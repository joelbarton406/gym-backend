-- Terminate all connections to the gym database
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'gym'
  AND pid <> pg_backend_pid();

-- Drop the database
DROP DATABASE gym;

DROP DATABASE IF EXISTS gym;

CREATE DATABASE gym;
\c gym;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE profile_type_enum AS ENUM ('client', 'instructor', 'visiting_instructor');
CREATE TYPE activity_type_enum AS ENUM ('cycling', 'yoga', 'lifting');
CREATE TYPE day_of_week_enum AS ENUM ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN');

DROP TABLE IF EXISTS member CASCADE;
DROP TABLE IF EXISTS class CASCADE;
DROP TABLE IF EXISTS enrollment CASCADE;

CREATE TABLE member (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(10) NOT NULL DEFAULT '0000000000',
    first_name VARCHAR(15) NOT NULL,
    last_name VARCHAR(15) NOT NULL,
    medical_notes TEXT,
    membership_start_date DATE,
    hire_date DATE,
    profile_type profile_type_enum NOT NULL
);

CREATE TABLE class (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_type activity_type_enum NOT NULL,
    subtitle VARCHAR(50) NOT NULL,
    day_of_week day_of_week_enum NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMP,
    location VARCHAR(255),
    capacity INT,
    instructor_id UUID REFERENCES member(id)
);

CREATE TABLE enrollment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status VARCHAR(50),
    enrollment_date DATE,
    member_id UUID REFERENCES member(id),
    class_id UUID REFERENCES class(id)
);

INSERT INTO member (email, first_name, last_name, profile_type, phone_number, medical_notes, membership_start_date, hire_date) VALUES
('joel@example.com', 'Joel', 'Barton', 'client', '4065995509', 'No allergies, very chill', '2023-01-01', null),
('rich@example.com', 'Rich', 'Barton', 'client', '4065392045', 'Allergic to peanuts', '2023-01-01', null),
('tess@example.com', 'Tess', 'Barton', 'client', '4065999038', 'Allergic to water', '2023-01-01', null),
('maren@example.com', 'Maren', 'Dunn', 'client', '0000000000', 'Allergic to peanuts', '2023-01-01', null),
('steven@base.com', 'Steven', 'Reid', 'instructor', '0000000000', 'Allergic to bullshit', '2023-01-01', '2020-01-01'),
('cackie@base.com', 'Cackie', 'Brousseau', 'instructor', '0000000000', 'No allergies, very chill', '2023-01-01', '2022-01-01'),
('karl@base.com', 'Karl', 'Rempe', 'instructor', '0000000000', 'No allergies, very chill', '2023-01-01', '2024-01-01');

INSERT INTO class (activity_type, subtitle, day_of_week, instructor_id, scheduled_at, location, capacity) VALUES
('cycling', 'recovery', 'WED', (SELECT id FROM member WHERE email = 'cackie@base.com'), '2025-02-12 17:30:00', 'Multipurpose Room A', 9),
('cycling', 'hiit', 'MON', (SELECT id FROM member WHERE email = 'cackie@base.com'), '2025-02-10 6:15:00', 'Multipurpose Room A', 9),
('cycling', 'hiit', 'TUE', (SELECT id FROM member WHERE email = 'cackie@base.com'), '2025-02-11 6:15:00', 'Multipurpose Room A', 9),
('cycling', 'hiit', 'WED', (SELECT id FROM member WHERE email = 'cackie@base.com'), '2025-02-12 6:15:00', 'Multipurpose Room A', 9),
('cycling', 'hiit', 'THU', (SELECT id FROM member WHERE email = 'cackie@base.com'), '2025-02-13 6:15:00', 'Multipurpose Room A', 9),
('cycling', 'hiit', 'FRI', (SELECT id FROM member WHERE email = 'cackie@base.com'), '2025-02-14 6:15:00', 'Multipurpose Room A', 9),
('yoga', 'flow', 'MON', (SELECT id FROM member WHERE email = 'karl@base.com'), '2025-02-10 8:00:00', 'Multipurpose Room B', 16),
('yoga', 'recovery', 'TUE', (SELECT id FROM member WHERE email = 'steven@base.com'), '2025-02-11 17:00:00', 'Multipurpose Room B', 16),
('yoga', 'flow', 'WED', (SELECT id FROM member WHERE email = 'karl@base.com'), '2025-02-12 8:00:00', 'Multipurpose Room B', 16),
('yoga', 'recovery', 'THU', (SELECT id FROM member WHERE email = 'steven@base.com'), '2025-02-13 17:00:00', 'Multipurpose Room B', 16),
('yoga', 'flow', 'FRI', (SELECT id FROM member WHERE email = 'karl@base.com'), '2025-02-14 8:00:00', 'Multipurpose Room B', 16),
('lifting', 'strength', 'MON', (SELECT id FROM member WHERE email = 'karl@base.com'), '2025-02-10 9:30:00', 'Second Floor', 5),
('lifting', 'strength', 'FRI', (SELECT id FROM member WHERE email = 'karl@base.com'), '2025-02-14 9:30:00', 'Second Floor', 5);

INSERT INTO enrollment (member_id, class_id, status, enrollment_date)
SELECT 
    (SELECT id FROM member WHERE email = 'joel@example.com'),
    id,
    'active',
    '2023-01-01'
FROM class
WHERE activity_type = 'cycling';

INSERT INTO enrollment (member_id, class_id, status, enrollment_date)
SELECT 
    (SELECT id FROM member WHERE email = 'maren@example.com'),
    id,
    'active',
    '2023-01-01'
FROM class
WHERE activity_type = 'yoga';


INSERT INTO enrollment (member_id, class_id, status, enrollment_date)
SELECT 
    (SELECT id FROM member WHERE email = 'rich@example.com'),
    id,
    'active',
    '2023-01-01'
FROM class
WHERE activity_type = 'lifting';


