-- =========================================================
-- SMART HOSPITAL APPOINTMENT SYSTEM
-- Database Initialization Script
-- =========================================================

-- Create database
CREATE DATABASE IF NOT EXISTS smart_hospital
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE smart_hospital;

-- =========================================================
-- IMPORTANT
-- =========================================================
-- Spring Boot + JPA/Hibernate can create/update application
-- tables automatically when:
--
-- spring.jpa.hibernate.ddl-auto=update
--
-- Therefore, tables such as users, doctors and appointments
-- should normally be managed by JPA entities.
--
-- This SQL file is mainly used to:
-- 1. Create the database
-- 2. Store optional application metadata
-- 3. Insert development/sample data
-- =========================================================


-- =========================================================
-- APPLICATION NOTES
-- =========================================================

CREATE TABLE IF NOT EXISTS app_note (
    id BIGINT NOT NULL AUTO_INCREMENT,
    note VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
);


-- Insert initialization message only if it does not already exist
INSERT INTO app_note (note)
SELECT 'Smart Hospital database initialized'
WHERE NOT EXISTS (
    SELECT 1
    FROM app_note
    WHERE note = 'Smart Hospital database initialized'
);


-- =========================================================
-- OPTIONAL: VERIFY DATABASE
-- =========================================================

SELECT DATABASE() AS current_database;

SELECT *
FROM app_note
ORDER BY id DESC;
