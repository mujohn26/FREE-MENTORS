import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on('error', (err) => {
  console.log(err);
});

const createTables = pool.query(`DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    id SERIAL NOT NULL,
    firstName VARCHAR NOT NULL,
    lastName VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    address VARCHAR NOT NULL,
    bio VARCHAR NOT NULL,
    occupation VARCHAR NOT NULL,
    expertise VARCHAR NOT NULL,
    ismentor boolean default false,
    isadmin boolean default false
    
);
INSERT INTO users (
     firstName, lastName, email, password, address,bio,occupation,expertise,ismentor,isadmin
    ) VALUES (
        'munezero',
        'pacifique',
        'mujohn68@gmail.com',
        '$2b$10$d9H69WXJ90JViosDOY8bkux594B2Zu.yo/Y0rVsCcBrw3rT6DtnY6',
         'kigali',
         'born in Rwanda',
         'software engineer',
         'angular js',
         true,
         true
),(
  'munezero',
  'pacifique',
  'mujohn681@gmail.com',
  '$2b$10$d9H69WXJ90JViosDOY8bkux594B2Zu.yo/Y0rVsCcBrw3rT6DtnY6',
   'kigali',
   'born in Rwanda',
   'software engineer',
   'angular js',
   true,
   false
),(
  'munezero',
  'pacifique',
  'mujohn682@gmail.com',
  '$2b$10$d9H69WXJ90JViosDOY8bkux594B2Zu.yo/Y0rVsCcBrw3rT6DtnY6',
   'kigali',
   'born in Rwanda',
   'software engineer',
   'angular js',
   true,
   true
);
DROP TABLE IF EXISTS sessions CASCADE;CREATE TABLE sessions(
  sessionId SERIAL NOT NULL,
  mentorid INTEGER NOT NULL,
  questions VARCHAR NOT NULL,
  menteeId INTEGER NOT NULL,
  menteeEmail VARCHAR NOT NULL,
  status VARCHAR NOT NULL
);
INSERT INTO sessions(mentorid ,questions,menteeId,menteeEmail,status)
VALUES(
    3,
 'studying',
    2,
 'mj06@gmail.com',
 'accepted'
);

`);

export default createTables;
