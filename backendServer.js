// server.js
require('dotenv').config();
import express, { json } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { query } from './db';
import { v4 as uuidv4 } from 'uuid';

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const SWIPE_LIMIT_PER_DAY = 10;

const app = express();

app.use(helmet());
app.use(cors());
app.use(json());

// Basic rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20
});

// ----------------- utility helpers -----------------
function signToken(user) {
  return sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

async function getUserByEmail(email) {
  const q = 'SELECT id, email, password_hash, role, name FROM users WHERE email = $1';
  const r = await query(q, [email]);
  return r.rows[0];
}

async function createUser({ email, passwordHash, role, name }) {
  const q = `INSERT INTO users (id, email, password_hash, role, name) VALUES ($1,$2,$3,$4,$5) RETURNING id,email,role,name`;
  const id = uuidv4();
  const r = await query(q, [id, email, passwordHash, role, name]);
  return r.rows[0];
}

function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing auth' });
  const token = h.split(' ')[1];
  try {
    const payload = verify(token, JWT_SECRET);
    req.user = payload; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (req.user.role !== role && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// ----------------- health -----------------
app.get('/health', (req, res) => res.json({ ok: true }));

// ----------------- auth -----------------
app.post('/auth/register', authLimiter, async (req, res) => {
  try {
    const { email, password, role = 'ADOPTEE', name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    if (!['ADOPTEE', 'SHELTER', 'ADMIN'].includes(role)) return res.status(400).json({ error: 'invalid role' });

    const existing = await getUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'email already registered' });

    const passwordHash = await hash(password, 10);
    const user = await createUser({ email, passwordHash, role, name });

    // If shelter, create a shelters row (optional)
    if (role === 'SHELTER') {
      const shelterId = uuidv4();
      await query(
        `INSERT INTO shelters (id, user_id, name) VALUES ($1,$2,$3)`,
        [shelterId, user.id, name || null]
      );
    }

    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

app.post('/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    const user = await getUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'invalid credentials' });

    const ok = await compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });

    const token = signToken(user);
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/me', authMiddleware, async (req, res) => {
  // returns basic info about the user
  try {
    const userId = req.user.id;
    const r = await query('SELECT id,email,role,name,created_at FROM users WHERE id=$1', [userId]);
    if (!r.rows[0]) return res.status(404).json({ error: 'user not found' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// ----------------- shelter: create / list dogs -----------------
app.post('/shelter/dogs', authMiddleware, requireRole('SHELTER'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, species, breed, age_months, sex, size, description } = req.body;
    // find shelter id
    const shelterRes = await query('SELECT id FROM shelters WHERE user_id=$1', [userId]);
    if (!shelterRes.rows[0]) return res.status(400).json({ error: 'shelter profile not found' });
    const shelterId = shelterRes.rows[0].id;
    const dogId = uuidv4();
    const q = `INSERT INTO dogs (id, shelter_id, name, species, breed, age_months, sex, size, description)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;
    const r = await query(q, [dogId, shelterId, name, species, breed, age_months, sex, size, description]);
    res.status(201).json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/shelter/dogs', authMiddleware, requireRole('SHELTER'), async (req, res) => {
  try {
    const userId = req.user.id;
    const shelterRes = await query('SELECT id FROM shelters WHERE user_id=$1', [userId]);
    if (!shelterRes.rows[0]) return res.status(400).json({ error: 'shelter profile not found' });
    const shelterId = shelterRes.rows[0].id;
    const r = await query('SELECT * FROM dogs WHERE shelter_id=$1 ORDER BY created_at DESC', [shelterId]);
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// ----------------- feed for adoptees -----------------
app.get('/dogs/feed', authMiddleware, requireRole('ADOPTEE'), async (req, res) => {
  try {
    const userId = req.user.id;
    // For MVP: return AVAILABLE dogs that this adopter hasn't swiped on yet.
    const q = `
      SELECT d.*,
        (SELECT url FROM dog_photos dp WHERE dp.dog_id = d.id ORDER BY sort_order LIMIT 1) AS photo_url
      FROM dogs d
      WHERE d.status = 'AVAILABLE'
        AND NOT EXISTS (SELECT 1 FROM swipes s WHERE s.dog_id = d.id AND s.adopter_user_id = $1)
      ORDER BY d.created_at DESC
      LIMIT 20
    `;
    const r = await query(q, [userId]);
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// ----------------- swipes -----------------
// POST /swipes { dogId, direction }
app.post('/swipes', authMiddleware, requireRole('ADOPTEE'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { dogId, direction } = req.body;
    if (!dogId || !['LEFT', 'RIGHT'].includes(direction)) {
      return res.status(400).json({ error: 'dogId and direction (LEFT|RIGHT) required' });
    }

    // Enforce limit: count swipes today
    const countQ = `SELECT COUNT(*) FROM swipes WHERE adopter_user_id = $1 AND created_at >= (date_trunc('day', NOW()))`;
    const cntRes = await query(countQ, [userId]);
    const todayCount = parseInt(cntRes.rows[0].count, 10);
    if (todayCount >= SWIPE_LIMIT_PER_DAY) {
      return res.status(429).json({ error: 'Swipe limit reached for today', remaining: 0 });
    }

    // Insert swipe - uniqueness prevents duplicate swipes
    try {
      const swipeId = uuidv4();
      const iq = `INSERT INTO swipes (id, adopter_user_id, dog_id, direction) VALUES ($1,$2,$3,$4) RETURNING *`;
      const insertRes = await query(iq, [swipeId, userId, dogId, direction]);

      // If RIGHT, add to favorites (idempotent)
      if (direction === 'RIGHT') {
        const favQ = `INSERT INTO favorites (id, user_id, dog_id) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`;
        await query(favQ, [uuidv4(), userId, dogId]);
      }

      const remaining = Math.max(0, SWIPE_LIMIT_PER_DAY - (todayCount + 1));
      return res.json({ swipe: insertRes.rows[0], remaining });
    } catch (err) {
      // Unique violation (duplicate swipe)
      if (err && err.code === '23505') { // Postgres unique_violation
        return res.status(409).json({ error: 'Already swiped this dog' });
      }
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/swipes/remaining', authMiddleware, requireRole('ADOPTEE'), async (req, res) => {
  try {
    const userId = req.user.id;
    const countQ = `SELECT COUNT(*) FROM swipes WHERE adopter_user_id = $1 AND created_at >= (date_trunc('day', NOW()))`;
    const cntRes = await query(countQ, [userId]);
    const todayCount = parseInt(cntRes.rows[0].count, 10);
    const remaining = Math.max(0, SWIPE_LIMIT_PER_DAY - todayCount);
    res.json({ remaining });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// ----------------- favorites list -----------------
app.get('/favorites', authMiddleware, requireRole('ADOPTEE'), async (req, res) => {
  try {
    const userId = req.user.id;
    const q = `
      SELECT f.*, d.name, d.species, d.breed,
        (SELECT url FROM dog_photos dp WHERE dp.dog_id = d.id ORDER BY sort_order LIMIT 1) AS photo_url
      FROM favorites f
      JOIN dogs d ON d.id = f.dog_id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
    `;
    const r = await query(q, [userId]);
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// ----------------- convert favorite -> match (create conversation)
app.post('/favorites/:dogId/match', authMiddleware, requireRole('ADOPTEE'), async (req, res) => {
  try {
    const userId = req.user.id;
    const dogId = req.params.dogId;

    // ensure favorite exists
    const favRes = await query('SELECT * FROM favorites WHERE user_id=$1 AND dog_id=$2', [userId, dogId]);
    if (!favRes.rows[0]) return res.status(400).json({ error: 'Dog not in favorites' });

    // create match row (idempotent)
    try {
      await query('INSERT INTO matches (id, user_id, dog_id) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING', [uuidv4(), userId, dogId]);
    } catch (e) {
      // ignore
    }

    // Find shelter for that dog
    const dogRes = await query('SELECT shelter_id FROM dogs WHERE id=$1', [dogId]);
    if (!dogRes.rows[0]) return res.status(404).json({ error: 'Dog not found' });
    const shelterId = dogRes.rows[0].shelter_id;

    // Create or reuse conversation: unique(adopter,shelter,dog)
    const convQ = `INSERT INTO conversations (id, adopter_user_id, shelter_id, dog_id) VALUES ($1,$2,$3,$4)
                   ON CONFLICT (adopter_user_id, shelter_id, dog_id) DO NOTHING RETURNING *`;
    const convId = uuidv4();
    const convRes = await query(convQ, [convId, userId, shelterId, dogId]);

    // If no row returned, fetch existing
    let conversation = convRes.rows[0];
    if (!conversation) {
      const cr = await query(
        'SELECT * FROM conversations WHERE adopter_user_id=$1 AND shelter_id=$2 AND dog_id=$3',
        [userId, shelterId, dogId]
      );
      conversation = cr.rows[0];
    }

    res.json({ conversation, status: 'MATCH_CREATED' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// ----------------- shelter: who liked my dogs -----------------
app.get('/shelter/likes', authMiddleware, requireRole('SHELTER'), async (req, res) => {
  try {
    const userId = req.user.id;
    const shelterRes = await query('SELECT id FROM shelters WHERE user_id=$1', [userId]);
    if (!shelterRes.rows[0]) return res.status(400).json({ error: 'shelter profile not found' });
    const shelterId = shelterRes.rows[0].id;

    // List all right-swipes for dogs owned by this shelter
    const q = `
      SELECT s.adopter_user_id, s.dog_id, s.created_at, u.email, u.name, d.name as dog_name
      FROM swipes s
      JOIN dogs d ON d.id = s.dog_id
      JOIN users u ON u.id = s.adopter_user_id
      WHERE d.shelter_id = $1 AND s.direction = 'RIGHT'
      ORDER BY s.created_at DESC
    `;
    const r = await query(q, [shelterId]);
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// ----------------- basic error handler -----------------
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});