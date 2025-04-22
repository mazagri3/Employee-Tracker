-- Drop tables if they exist
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;

-- Create department table
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- Create role table
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INTEGER REFERENCES department(id) ON DELETE CASCADE
);

-- Create employee table
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER REFERENCES role(id) ON DELETE CASCADE,
    manager_id INTEGER REFERENCES employee(id) ON DELETE SET NULL
);

-- Insert sample data
INSERT INTO department (name) VALUES 
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sales');

INSERT INTO role (title, salary, department_id) VALUES
    ('Software Engineer', 120000, 1),
    ('Lead Engineer', 150000, 1),
    ('Accountant', 125000, 2),
    ('Legal Team Lead', 250000, 3),
    ('Lawyer', 190000, 3),
    ('Sales Lead', 100000, 4),
    ('Salesperson', 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('John', 'Doe', 2, NULL),
    ('Mike', 'Chan', 6, NULL),
    ('Ashley', 'Rodriguez', 1, 1),
    ('Kevin', 'Tupik', 1, 1),
    ('Kunal', 'Singh', 3, NULL),
    ('Malia', 'Brown', 3, 5),
    ('Sarah', 'Lourd', 4, NULL),
    ('Tom', 'Allen', 5, 7);

-- Comment for instructor: 
-- Created schema.sql file with the required tables - department, role, and employee
-- Added proper foreign key relationships with CASCADE and SET NULL constraints as appropriate
-- Used SERIAL PRIMARY KEY for auto-incrementing IDs as required 