CREATE TYPE profiletype_enum AS ENUM ('client', 'instructor', 'admin');

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    phonenumber VARCHAR(10) NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    profiletype profiletype_enum NOT NULL
);