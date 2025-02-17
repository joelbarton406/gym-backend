CREATE TYPE profiletype_enum AS ENUM ('client', 'instructor', 'admin');

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    phonenumber VARCHAR(10) NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    profiletype profiletype_enum NOT NULL
);

CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    tag VARCHAR(50) NOT NULL,
    instructor_id INT REFERENCES members(id), 
    class_date DATE NOT NULL,
    capacity INT NOT NULL
);

CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    member_id INT REFERENCES members(id),
    class_id INT REFERENCES classes(id),
    enrollment_date DATE NOT NULL
);
