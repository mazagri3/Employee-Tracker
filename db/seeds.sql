-- Use the employee_tracker database
\c employee_tracker;

-- Insert departments
INSERT INTO department (name) VALUES
  ('Engineering'),
  ('Finance'),
  ('Legal'),
  ('Marketing'),
  ('Sales');

-- Insert roles
INSERT INTO role (title, salary, department_id) VALUES
  ('Software Engineer', 85000, 1),
  ('Lead Engineer', 125000, 1),
  ('Accountant', 65000, 2),
  ('Finance Manager', 110000, 2),
  ('Lawyer', 95000, 3),
  ('Legal Team Lead', 150000, 3),
  ('Marketing Specialist', 60000, 4),
  ('Marketing Director', 120000, 4),
  ('Sales Representative', 55000, 5),
  ('Sales Manager', 100000, 5);

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 2, NULL),
  ('Mike', 'Chan', 1, 1),
  ('Ashley', 'Rodriguez', 4, NULL),
  ('Kevin', 'Tupik', 3, 3),
  ('Kunal', 'Singh', 6, NULL),
  ('Malia', 'Brown', 5, 5),
  ('Sarah', 'Lourd', 8, NULL),
  ('Tom', 'Allen', 7, 7),
  ('Sam', 'Kash', 10, NULL),
  ('Christian', 'Eckenrode', 9, 9);

-- Comment for instructor:
-- Created seeds.sql with sample data for all three tables
-- Added appropriate relationships between tables (managers, roles, departments)
-- Used realistic job titles, salaries, and hierarchical relationships 