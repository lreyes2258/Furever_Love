USE Furever_Love;
DROP TABLE IF EXISTS animals;
DROP TABLE IF EXISTS email_verification_tokens;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS likes;

CREATE TABLE users (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
email VARCHAR(255) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL, 
role ENUM('shelter','adopter') NOT NULL DEFAULT 'adopter',
is_email_verified TINYINT(1) NOT NULL DEFAULT 0,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (id)
);

CREATE TABLE email_verification_tokens (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
user_id BIGINT UNSIGNED NOT NULL,
token_hash CHAR(64) NOT NULL,
expires_at DATETIME NOT NULL,
used_at DATETIME NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (id),
INDEX idx_evt_user_id (user_id),
INDEX idx_evt_token_hash (token_hash),
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
 
 
CREATE TABLE animals (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
shelter_id BIGINT UNSIGNED NOT NULL,
name VARCHAR(120) NOT NULL,
species VARCHAR(80) NOT NULL,
breed VARCHAR(120),
age INT,
sex VARCHAR(30),
description TEXT,
status ENUM('available','adopted','hold') NOT NULL DEFAULT 'available',
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (id),
INDEX idx_animals_shelter_id (shelter_id),
INDEX idx_animals_status (status),
FOREIGN KEY (shelter_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE likes (
id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
user_id BIGINT UNSIGNED NOT NULL,
animal_id BIGINT UNSIGNED NOT NULL,
liked BOOLEAN NOT NULL,
swiped_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

UNIQUE KEY unique_swipe_per_day(user_id, animal_id, DATE(swiped_at)),

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE

);
 


