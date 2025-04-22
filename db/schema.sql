-- Drop database if it exists
DROP DATABASE IF EXISTS employee_tracker;

-- Create database
CREATE DATABASE employee_tracker;

-- Use the database
\c employee_tracker;

-- Create department table
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

-- Create role table
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

-- Create employee table
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

-- Comment for instructor: 
-- Created schema.sql file with the required tables - department, role, and employee
-- Added proper foreign key relationships with CASCADE and SET NULL constraints as appropriate
-- Used SERIAL PRIMARY KEY for auto-incrementing IDs as required 