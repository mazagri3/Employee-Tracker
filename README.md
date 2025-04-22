# Employee Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

A command-line application to manage a company's employee database. This application allows business owners to view and manage departments, roles, and employees in their company, helping them organize and plan their business.

Built using Node.js, Inquirer, and PostgreSQL, this Content Management System (CMS) provides an efficient interface for managing a company's organizational structure and personnel.

## Video Walkthrough

[Click here to view the walkthrough video](https://drive.google.com/file/d/1BW7FACp9zU0QwUdjUHPi1-RoGd-xFz01/view?usp=drive_link)

## Features

### Core Features
- View all departments, roles, and employees
- Add departments, roles, and employees
- Update employee roles

### Bonus Features
- Update employee managers
- View employees by manager
- View employees by department
- Delete departments, roles, and employees
- View total utilized budget of a department

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mazagri3/employee-tracker.git
cd employee-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up the PostgreSQL database:
```bash
psql -U postgres < db/schema.sql
psql -U postgres < db/seeds.sql
```

4. Update database credentials:
   - Open `db/connection.js`
   - Update the user, password, and other connection details if needed

## Usage

Start the application:
```bash
npm start
```

Follow the prompts to:
- View all departments, roles, or employees
- Add a department, role, or employee
- Update an employee's role
- Additional bonus options (update manager, view by manager/department, delete entries, view budget)

## Database Schema

The application uses the following database schema:

![Database Schema](./Assets/100-sql-challenge-ERD.png)

- **department**
  - id: SERIAL PRIMARY KEY
  - name: VARCHAR(30) UNIQUE NOT NULL

- **role**
  - id: SERIAL PRIMARY KEY
  - title: VARCHAR(30) UNIQUE NOT NULL
  - salary: DECIMAL NOT NULL
  - department_id: INTEGER NOT NULL (Foreign Key to department.id)

- **employee**
  - id: SERIAL PRIMARY KEY
  - first_name: VARCHAR(30) NOT NULL
  - last_name: VARCHAR(30) NOT NULL
  - role_id: INTEGER NOT NULL (Foreign Key to role.id)
  - manager_id: INTEGER (Foreign Key to employee.id, can be null)

## Technologies Used

- Node.js
- Inquirer v8.2.4
- PostgreSQL
- console.table
- pg (PostgreSQL client for Node.js)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Created by Obi Mazagri

---
© 2024 Employee Tracker. All Rights Reserved.
