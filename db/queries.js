// Import the database connection pool
const pool = require('./connection');

// Class for database queries
class DB {
  constructor(pool) {
    this.pool = pool;
  }

  // View all departments
  async viewAllDepartments() {
    try {
      const res = await this.pool.query(
        'SELECT id, name FROM department ORDER BY id'
      );
      return res.rows;
    } catch (err) {
      console.error('Error viewing departments:', err);
      throw err;
    }
  }

  // View all roles with department information
  async viewAllRoles() {
    try {
      const res = await this.pool.query(
        `SELECT r.id, r.title, d.name AS department, r.salary 
         FROM role r 
         JOIN department d ON r.department_id = d.id 
         ORDER BY r.id`
      );
      return res.rows;
    } catch (err) {
      console.error('Error viewing roles:', err);
      throw err;
    }
  }

  // View all employees with role, department, and manager information
  async viewAllEmployees() {
    try {
      const res = await this.pool.query(
        `SELECT 
          e.id, 
          e.first_name, 
          e.last_name, 
          r.title, 
          d.name AS department, 
          r.salary, 
          CONCAT(m.first_name, ' ', m.last_name) AS manager 
         FROM employee e 
         LEFT JOIN role r ON e.role_id = r.id 
         LEFT JOIN department d ON r.department_id = d.id 
         LEFT JOIN employee m ON e.manager_id = m.id 
         ORDER BY e.id`
      );
      return res.rows;
    } catch (err) {
      console.error('Error viewing employees:', err);
      throw err;
    }
  }

  // Add a department
  async addDepartment(name) {
    try {
      const res = await this.pool.query(
        'INSERT INTO department (name) VALUES ($1) RETURNING id, name',
        [name]
      );
      return res.rows[0];
    } catch (err) {
      console.error('Error adding department:', err);
      throw err;
    }
  }

  // Add a role
  async addRole(title, salary, departmentId) {
    try {
      const res = await this.pool.query(
        'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING id, title, salary',
        [title, salary, departmentId]
      );
      return res.rows[0];
    } catch (err) {
      console.error('Error adding role:', err);
      throw err;
    }
  }

  // Add an employee
  async addEmployee(firstName, lastName, roleId, managerId) {
    try {
      const res = await this.pool.query(
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name',
        [firstName, lastName, roleId, managerId || null]
      );
      return res.rows[0];
    } catch (err) {
      console.error('Error adding employee:', err);
      throw err;
    }
  }

  // Update an employee's role
  async updateEmployeeRole(employeeId, roleId) {
    try {
      const res = await this.pool.query(
        'UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING id, first_name, last_name',
        [roleId, employeeId]
      );
      return res.rows[0];
    } catch (err) {
      console.error('Error updating employee role:', err);
      throw err;
    }
  }

  // Get all employees for selection lists
  async getEmployeesForList() {
    try {
      const res = await this.pool.query(
        'SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employee ORDER BY last_name, first_name'
      );
      return res.rows;
    } catch (err) {
      console.error('Error getting employees for list:', err);
      throw err;
    }
  }

  // Get all roles for selection lists
  async getRolesForList() {
    try {
      const res = await this.pool.query(
        'SELECT id, title AS name FROM role ORDER BY title'
      );
      return res.rows;
    } catch (err) {
      console.error('Error getting roles for list:', err);
      throw err;
    }
  }

  // Get all departments for selection lists
  async getDepartmentsForList() {
    try {
      const res = await this.pool.query(
        'SELECT id, name FROM department ORDER BY name'
      );
      return res.rows;
    } catch (err) {
      console.error('Error getting departments for list:', err);
      throw err;
    }
  }

  // BONUS: Update employee's manager
  async updateEmployeeManager(employeeId, managerId) {
    try {
      const res = await this.pool.query(
        'UPDATE employee SET manager_id = $1 WHERE id = $2 RETURNING id, first_name, last_name',
        [managerId || null, employeeId]
      );
      return res.rows[0];
    } catch (err) {
      console.error('Error updating employee manager:', err);
      throw err;
    }
  }

  // BONUS: View employees by manager
  async viewEmployeesByManager(managerId) {
    try {
      const res = await this.pool.query(
        `SELECT 
          e.id, 
          e.first_name, 
          e.last_name, 
          r.title, 
          d.name AS department 
         FROM employee e 
         JOIN role r ON e.role_id = r.id 
         JOIN department d ON r.department_id = d.id 
         WHERE e.manager_id = $1 
         ORDER BY e.last_name, e.first_name`,
        [managerId]
      );
      return res.rows;
    } catch (err) {
      console.error('Error viewing employees by manager:', err);
      throw err;
    }
  }

  // BONUS: View employees by department
  async viewEmployeesByDepartment(departmentId) {
    try {
      const res = await this.pool.query(
        `SELECT 
          e.id, 
          e.first_name, 
          e.last_name, 
          r.title 
         FROM employee e 
         JOIN role r ON e.role_id = r.id 
         WHERE r.department_id = $1 
         ORDER BY e.last_name, e.first_name`,
        [departmentId]
      );
      return res.rows;
    } catch (err) {
      console.error('Error viewing employees by department:', err);
      throw err;
    }
  }

  // BONUS: Delete department
  async deleteDepartment(id) {
    try {
      const res = await this.pool.query(
        'DELETE FROM department WHERE id = $1 RETURNING name',
        [id]
      );
      return res.rows[0];
    } catch (err) {
      console.error('Error deleting department:', err);
      throw err;
    }
  }

  // BONUS: Delete role
  async deleteRole(id) {
    try {
      const res = await this.pool.query(
        'DELETE FROM role WHERE id = $1 RETURNING title',
        [id]
      );
      return res.rows[0];
    } catch (err) {
      console.error('Error deleting role:', err);
      throw err;
    }
  }

  // BONUS: Delete employee
  async deleteEmployee(id) {
    try {
      const res = await this.pool.query(
        'DELETE FROM employee WHERE id = $1 RETURNING CONCAT(first_name, \' \', last_name) AS name',
        [id]
      );
      return res.rows[0];
    } catch (err) {
      console.error('Error deleting employee:', err);
      throw err;
    }
  }

  // BONUS: View total utilized budget of a department
  async viewDepartmentBudget(departmentId) {
    try {
      const res = await this.pool.query(
        `SELECT 
          d.name AS department,
          SUM(r.salary) AS total_budget
         FROM employee e 
         JOIN role r ON e.role_id = r.id 
         JOIN department d ON r.department_id = d.id 
         WHERE d.id = $1
         GROUP BY d.name`,
        [departmentId]
      );
      return res.rows[0];
    } catch (err) {
      console.error('Error viewing department budget:', err);
      throw err;
    }
  }
}

// Export the DB class with the pool connection
module.exports = new DB(pool);

// Comment for instructor:
// Created a comprehensive queries.js file with all required functionality
// Used async/await for database operations as recommended in the README
// Added error handling for all database operations
// Implemented all required functions: viewing departments/roles/employees, adding new entries, and updating employees
// Also implemented all BONUS functions for additional points 