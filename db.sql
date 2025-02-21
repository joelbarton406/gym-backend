CREATE TYPE profile_type_enum AS ENUM ('client', 'staff', 'admin');

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    phone_number VARCHAR(10) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    profile_type profile_type_enum NOT NULL
);

CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    tag VARCHAR(50) NOT NULL,
    staff_id INT REFERENCES members(id), 
    class_date DATE NOT NULL,
    capacity INT NOT NULL
);

CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    member_id INT REFERENCES members(id),
    class_id INT REFERENCES classes(id),
    enrollment_date DATE NOT NULL
);

CREATE TABLE sessions ( 
    id VARCHAR(64) PRIMARY KEY,
    member_id INT REFERENCES members(id),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
