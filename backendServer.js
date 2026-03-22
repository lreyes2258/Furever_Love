require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); 
const cors = require('cors'); // for cross-origin requests (e.g. from frontend)
const mysql = require('mysql2/promise'); //
const bcrypt = require('bcryptjs'); // for password hashing
const jwt = require('jsonwebtoken'); // for authentication tokens
const nodemailer = require('nodemailer'); // for email verification 
const crypto = require('crypto'); // for token generation and hashing

const app = express();
app.use(express.json());


const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: FRONTEND_URL,
  optionsSuccessStatus: 200,
}));  

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;
// Ensure JWT_SECRET is set
if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET');
}


// Config
const DB_CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306), 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};


const APP_BASE_URL = process.env.APP_BASE_URL || FRONTEND_URL;

// Email transport 

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE || 'false') === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* =========================
   DB POOL + SCHEMA
========================= */
const pool = mysql.createPool(DB_CONFIG);

async function initDb() {
  // Create DB (if missing) then select it
  await pool.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
  await pool.query(`USE \`${process.env.DB_NAME}\`;`);

  // USERS
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('shelter','adopter') NOT NULL DEFAULT 'adopter',
      is_email_verified TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    );
  `);

  // EMAIL VERIFICATION TOKENS (one-time)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS email_verification_tokens (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      user_id BIGINT UNSIGNED NOT NULL,
      token_hash CHAR(64) NOT NULL,
      expires_at DATETIME NOT NULL,
      used_at DATETIME NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      INDEX idx_evt_user_id (user_id),
      INDEX idx_evt_token_hash (token_hash),
      CONSTRAINT fk_evt_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
    );
  `);

  // ANIMALS
  await pool.query(`
    CREATE TABLE IF NOT EXISTS animals (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      shelter_id BIGINT UNSIGNED NOT NULL,
      name VARCHAR(120) NOT NULL,
      species VARCHAR(80) NOT NULL,
      breed VARCHAR(120) NULL,
      age INT NULL,
      sex VARCHAR(30) NULL,
      description TEXT NULL,
      status ENUM('available','adopted','hold') NOT NULL DEFAULT 'available',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      INDEX idx_animals_shelter_id (shelter_id),
      INDEX idx_animals_status (status),
      CONSTRAINT fk_animals_shelter
        FOREIGN KEY (shelter_id) REFERENCES users(id)
        ON DELETE CASCADE
    );
  `)
  
  // LIKES (for adopters swiping on animals);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS likes (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    animal_id BIGINT UNSIGNED NOT NULL,
    liked BOOLEAN NOT NULL,
    swiped_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY unique_swipe (user_id, animal_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
  );
  `);
}

/* =========================
   HELPERS
========================= */
function authMiddleware(req, res, next) {
  const authHeader = req.header('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { userId, email, role }
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireShelter(req, res, next) {
  if (req.user?.role !== 'shelter') {
    return res.status(403).json({ error: 'Only shelter accounts can manage animals' });
  }
  next();
}

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

async function sendVerificationEmail(email, verifyUrl) {
  // If SMTP not configured, just log the link (useful for dev)
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`(DEV) Verification link for ${email}: ${verifyUrl}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Verify your email',
    text: `Verify your email by clicking: ${verifyUrl}`,
  });
}

/* =========================
   ROUTES: HEALTH
========================= */
app.get('/', (req, res) => res.json({ ok: true }));

/* =========================
   ROUTES: AUTH
========================= */

// Register
// POST /api/auth/register
// body: { email, password, role } where role: "shelter" | "adopter"
app.post('/api/auth/register', async (req, res) => {
  const { email, password, role } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const safeRole = role === 'shelter' ? 'shelter' : 'adopter';

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (existing.length > 0) return res.status(409).json({ error: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, passwordHash, safeRole]
    );

    const userId = String(result.insertId);

    // Create email verification token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = sha256Hex(rawToken);

    // expires in 24 hours
    const [tokenInsert] = await pool.query(
      `INSERT INTO email_verification_tokens (user_id, token_hash, expires_at)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))`,
      [userId, tokenHash]
    );

    // Verification URL, point this to frontend; frontend then calls /verify)
    const verifyUrl = `${APP_BASE_URL}/verify-email?token=${rawToken}`;

    await sendVerificationEmail(email, verifyUrl);

    return res.status(201).json({
      id: userId,
      email,
      role: safeRole,
      isEmailVerified: false,
      message: 'Registered. Please verify your email.',
      // You might remove this in production; helpful for mobile dev testing:
      devVerifyLink: verifyUrl,
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Verify email
// POST /api/auth/verify-email
// body: { token }
app.post('/api/auth/verify-email', async (req, res) => {
  const { token } = req.body || {};
  if (!token) return res.status(400).json({ error: 'token required' });

  try {
    const tokenHash = sha256Hex(token);

    const [rows] = await pool.query(
      `SELECT id, user_id, expires_at, used_at
       FROM email_verification_tokens
       WHERE token_hash = ?
       LIMIT 1`,
      [tokenHash]
    );

    if (rows.length === 0) return res.status(400).json({ error: 'Invalid token' });

    const rec = rows[0];
    if (rec.used_at) return res.status(400).json({ error: 'Token already used' });

    // Check expiry
    const expiresAt = new Date(rec.expires_at);
    if (Date.now() > expiresAt.getTime()) return res.status(400).json({ error: 'Token expired' });

    // Mark token used + user verified
    await pool.query('UPDATE email_verification_tokens SET used_at = NOW() WHERE id = ?', [rec.id]);
    await pool.query('UPDATE users SET is_email_verified = 1 WHERE id = ?', [rec.user_id]);

    return res.json({ ok: true, message: 'Email verified' });
  } catch (err) {
    console.error('Verify email error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Resend verification email (optional)
// POST /api/auth/resend-verification
// body: { email }
app.post('/api/auth/resend-verification', async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email required' });

  try {
    const [users] = await pool.query(
      'SELECT id, email, is_email_verified FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (users.length === 0) return res.status(200).json({ ok: true }); // don't leak existence
    if (users[0].is_email_verified) return res.status(200).json({ ok: true });

    const userId = String(users[0].id);

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = sha256Hex(rawToken);

    await pool.query(
      `INSERT INTO email_verification_tokens (user_id, token_hash, expires_at)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))`,
      [userId, tokenHash]
    );

    const verifyUrl = `${APP_BASE_URL}/verify-email?token=${rawToken}`;
    await sendVerificationEmail(email, verifyUrl);

    return res.json({ ok: true, message: 'If the account exists, a verification email was sent.', devVerifyLink: verifyUrl });
  } catch (err) {
    console.error('Resend verification error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Login
// POST /api/auth/login
// body: { email, password }
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  try {
    const [rows] = await pool.query(
      'SELECT id, email, password_hash, role, is_email_verified FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = { userId: String(user.id), email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    return res.json({
      token,
      user: {
        id: String(user.id),
        email: user.email,
        role: user.role,
        isEmailVerified: Boolean(user.is_email_verified),
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

 //Routes for animals (CRUD for shelters, read-only for adopters, with some filtering)

// GET /api/animals
// Shelter -> only their animals
// Adopter -> only available animals
app.get('/api/animals', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'shelter') {
      const [rows] = await pool.query(
        `SELECT id, shelter_id, name, species, breed, age, sex, description, status, created_at
         FROM animals
         WHERE shelter_id = ?
         ORDER BY created_at DESC`,
        [req.user.userId]
      );
      return res.json(rows);
    }

    const [rows] = await pool.query(
      `SELECT id, shelter_id, name, species, breed, age, sex, description, status, created_at
       FROM animals
       WHERE status = 'available'
       ORDER BY created_at DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error('GET /api/animals error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/animals/:id
app.get('/api/animals/:id', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, shelter_id, name, species, breed, age, sex, description, status, created_at
       FROM animals
       WHERE id = ?
       LIMIT 1`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Animal not found' });

    const animal = rows[0];

    if (req.user.role === 'shelter') {
      if (String(animal.shelter_id) !== String(req.user.userId)) return res.status(403).json({ error: 'Forbidden' });
      return res.json(animal);
    }

    if (animal.status !== 'available') return res.status(403).json({ error: 'Forbidden' });
    return res.json(animal);
  } catch (err) {
    console.error('GET /api/animals/:id error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/animals (shelter only)
app.post('/api/animals', authMiddleware, requireShelter, async (req, res) => {
  const { name, species, breed, age, sex, description, status } = req.body || {};
  if (!name || !species) return res.status(400).json({ error: 'name and species required' });

  const safeStatus = ['available', 'adopted', 'hold'].includes(status) ? status : 'available';

  try {
    const [result] = await pool.query(
      `INSERT INTO animals (shelter_id, name, species, breed, age, sex, description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.userId,
        name,
        species,
        breed || null,
        typeof age === 'number' ? age : null,
        sex || null,
        description || null,
        safeStatus,
      ]
    );

    const [rows] = await pool.query(
      `SELECT id, shelter_id, name, species, breed, age, sex, description, status, created_at
       FROM animals
       WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /api/animals error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/animals/:id (shelter only)
app.patch('/api/animals/:id', authMiddleware, requireShelter, async (req, res) => {
  const allowed = ['name', 'species', 'breed', 'age', 'sex', 'description', 'status'];
  const updates = {};

  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(req.body || {}, key)) updates[key] = req.body[key];
  }
  if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No valid fields to update' });

  if ('status' in updates && !['available', 'adopted', 'hold'].includes(updates.status)) {
    updates.status = 'available';
  }

  try {
    const [existing] = await pool.query('SELECT id, shelter_id FROM animals WHERE id = ? LIMIT 1', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Animal not found' });
    if (String(existing[0].shelter_id) !== String(req.user.userId)) return res.status(403).json({ error: 'Forbidden' });

    const setClauses = [];
    const values = [];
    for (const [k, v] of Object.entries(updates)) {
      setClauses.push(`${k} = ?`);
      values.push(v === '' ? null : v);
    }
    values.push(req.params.id);

    await pool.query(`UPDATE animals SET ${setClauses.join(', ')} WHERE id = ?`, values);

    const [rows] = await pool.query(
      `SELECT id, shelter_id, name, species, breed, age, sex, description, status, created_at
       FROM animals
       WHERE id = ?`,
      [req.params.id]
    );

    return res.json(rows[0]);
  } catch (err) {
    console.error('PATCH /api/animals/:id error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/animals/:id (shelter only)
app.delete('/api/animals/:id', authMiddleware, requireShelter, async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT id, shelter_id FROM animals WHERE id = ? LIMIT 1', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Animal not found' });
    if (String(existing[0].shelter_id) !== String(req.user.userId)) return res.status(403).json({ error: 'Forbidden' });

    await pool.query('DELETE FROM animals WHERE id = ?', [req.params.id]);
    return res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/animals/:id error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

//like counter and limiter. The limit is ten likes per day.
const DAILY_LIKE_LIMIT = Number(process.env.DAILY_LIKE_LIMIT || 10); //so you can change the limit with env variable later if needed

async function hasReachedDailyLikeLimit(userId) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS like_count
    FROM likes
    WHERE user_id = ?
    AND liked =1
    AND swiped_at >= CURDATE()
    AND swiped_at < DATE_ADD(CURDATE(), INTERVAL 1 DAY)`, 
    [userId]
  );
  return rows[0].like_count >= DAILY_LIKE_LIMIT;
}
 

// Like Route
app.post('/api/animals/:id/like', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const animalId = req.params.id;

    if (req.user.role !== 'adopter') {
      return res.status(403).json({ error: 'Only adopters can like animals' });
    }

    const [animals] = await pool.query(
      'SELECT id, status FROM animals WHERE id = ? LIMIT 1',
      [animalId]
    );

    if (animals.length === 0) {
      return res.status(404).json({ error: 'Animal not found' });
    }

    if (animals[0].status !== 'available') {
      return res.status(400).json({ error: 'Only available animals can be liked' });
    }

    const [existing] = await pool.query(
      'SELECT id, liked FROM likes WHERE user_id = ? AND animal_id = ? LIMIT 1',
      [userId, animalId]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'You already swiped on this animal' });
    }

    const limitReached = await hasReachedDailyLikeLimit(userId);
    if (limitReached) {
      return res.status(429).json({ error: 'Daily like limit reached' });
    }

    await pool.query(
      'INSERT INTO likes (user_id, animal_id, liked) VALUES (?, ?, 1)',
      [userId, animalId]
    );

    return res.status(201).json({ ok: true, message: 'Like recorded' });
  } catch (err) {
    console.error('POST /api/animals/:id/like error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/*Pass route, as in just passing intead of liking.This will also prevent the same animal from popping up in your feed.
  This can be fully implemented later. */

app.post('/api/animals/:id/pass', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const animalId = req.params.id;

    if (req.user.role !== 'adopter') {
      return res.status(403).json({ error: 'Only adopters can swipe animals' });
    }

    const [animals] = await pool.query(
      'SELECT id FROM animals WHERE id = ? LIMIT 1',
      [animalId]
    );

    if (animals.length === 0) {
      return res.status(404).json({ error: 'Animal not found' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM likes WHERE user_id = ? AND animal_id = ? LIMIT 1',
      [userId, animalId]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'You already swiped on this animal' });
    }

    await pool.query(
      'INSERT INTO likes (user_id, animal_id, liked) VALUES (?, ?, 0)',
      [userId, animalId]
    );

    return res.status(201).json({ ok: true, message: 'Pass recorded' });
  } catch (err) {
    console.error('POST /api/animals/:id/pass error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

  

/* =========================
   START SERVER
========================= */
(async () => {
  try {
    await initDb();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`API running on http://0.0.0.0:${PORT}`); //for connection from other devices 
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();