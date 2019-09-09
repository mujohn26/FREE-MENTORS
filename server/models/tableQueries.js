import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on('error', (err) => {
  console.log(err);
});

const createTables = pool.query(`DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    id  SERIAL NOT NULL,
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
        '$2b$10$C7E/rKsvXCkj1iEPvP80uugryYPAmeHZ31cec1fuRulIGqdlVBdKe',
         'kigali',
         'born in Rwanda',
         'software engineer',
         'angular js',
         true,
         true
);
`);

export default createTables;
