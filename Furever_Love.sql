USE Furever_Love;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS dogs;
DROP TABLE IF EXISTS shelter;
DROP TABLE IF EXISTS user;

CREATE TABLE IF NOT EXISTS user (
user_id INT AUTO_INCREMENT PRIMARY KEY ,
username VARCHAR(25) NOT NULL,
email VARCHAR(100) UNIQUE,
password VARCHAR(50) NOT NULL, 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
first_name VARCHAR(100) NOT NULL,
last_name VARCHAR(100) NOT NULL
);

 CREATE TABLE IF NOT EXISTS shelter (
 shelter_id INT AUTO_INCREMENT PRIMARY KEY,
 shelter_name VARCHAR(100),
 address VARCHAR(200)
 );
 
 CREATE TABLE IF NOT EXISTS dogs (
 dog_id INT AUTO_INCREMENT PRIMARY KEY,
 dog_name VARCHAR(100),
 age INT,
 breed VARCHAR(100),
 shelter_arrival DATE,
 shelter_id INT NOT NULL,
 dog_description TEXT,
 FOREIGN KEY (shelter_id) references shelter(shelter_id)
 );
 
 CREATE TABLE IF NOT EXISTS likes (
 like_id INT AUTO_INCREMENT PRIMARY KEY,
 user_id INT NOT NULL,
 dog_id INT NOT NULL,
 liked BOOLEAN NOT NULL,
 FOREIGN KEY (user_id) references user(user_id),
 FOREIGN KEY(dog_id) references dogs(dog_id),
 swiped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY unique_swipe(user_id, dog_id)
 );

