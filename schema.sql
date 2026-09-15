CREATE DATABASE IF NOT EXISTS smart_hospital;
USE smart_hospital;

-- Spring Boot/JPA creates the tables automatically with ddl-auto=update.
-- This file is mainly for creating the database and optional sample SQL.

CREATE TABLE IF NOT EXISTS app_note (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    note VARCHAR(255)
);

INSERT INTO app_note(note) VALUES ('Smart Hospital database initialized');
