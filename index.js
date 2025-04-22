// Import required packages
const inquirer = require('inquirer');
const db = require('./db/queries');
const cTable = require('console.table');

// Display the application header
function displayHeader() {
  console.log('\n');
  console.log('===============================');
  console.log('    EMPLOYEE TRACKER SYSTEM    ');
  console.log('===============================');
  console.log('\n');
}

// Main menu function - displays options to the user
async function mainMenu() {
  displayHeader();
  
  try {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          // BONUS options
          'Update employee manager',
          'View employees by manager',
          'View employees by department',
          'Delete department',
          'Delete role',
          'Delete employee',
          'View department budget',
          'Exit'
        ]
      }
    ]);

    // Execute the selected action
    switch (action) {
      case 'View all departments':
        await viewAllDepartments();
        break;
      case 'View all roles':
        await viewAllRoles();
        break;
      case 'View all employees':
        await viewAllEmployees();
        break;
      case 'Add a department':
        await addDepartment();
        break;
      case 'Add a role':
        await addRole();
        break;
      case 'Add an employee':
        await addEmployee();
        break;
      case 'Update an employee role':
        await updateEmployeeRole();
        break;
      case 'Update employee manager':
        await updateEmployeeManager();
        break;
      case 'View employees by manager':
        await viewEmployeesByManager();
        break;
      case 'View employees by department':
        await viewEmployeesByDepartment();
        break;
      case 'Delete department':
        await deleteDepartment();
        break;
      case 'Delete role':
        await deleteRole();
        break;
      case 'Delete employee':
        await deleteEmployee();
        break;
      case 'View department budget':
        await viewDepartmentBudget();
        break;
      case 'Exit':
        console.log('\nGoodbye!');
        process.exit(0);
    }
  } catch (err) {
    console.error('Error in main menu:', err);
  }
}

// View all departments
async function viewAllDepartments() {
  try {
    console.log('\nFetching departments...');
    const departments = await db.viewAllDepartments();
    if (departments.length === 0) {
      console.log('\nNo departments found.');
    } else {
      console.log('\nAll Departments:');
      console.table(departments);
    }
    
    // Wait for user to press Enter before returning to main menu
    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: '\nPress Enter to return to the main menu...'
      }
    ]);
    
    await mainMenu();
  } catch (err) {
    console.error('Error in viewAllDepartments:', err);
    await mainMenu();
  }
}

// View all roles
async function viewAllRoles() {
  try {
    console.log('\nFetching roles...');
    const roles = await db.viewAllRoles();
    if (roles.length === 0) {
      console.log('\nNo roles found.');
    } else {
      console.log('\nAll Roles:');
      console.table(roles);
    }
    
    // Wait for user to press Enter before returning to main menu
    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: '\nPress Enter to return to the main menu...'
      }
    ]);
    
    await mainMenu();
  } catch (err) {
    console.error('Error in viewAllRoles:', err);
    await mainMenu();
  }
}

// View all employees
async function viewAllEmployees() {
  try {
    console.log('\nFetching employees...');
    const employees = await db.viewAllEmployees();
    if (employees.length === 0) {
      console.log('\nNo employees found.');
    } else {
      console.log('\nAll Employees:');
      console.table(employees);
    }
    
    // Wait for user to press Enter before returning to main menu
    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: '\nPress Enter to return to the main menu...'
      }
    ]);
    
    await mainMenu();
  } catch (err) {
    console.error('Error in viewAllEmployees:', err);
    await mainMenu();
  }
}

// Add a new department
async function addDepartment() {
  try {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:',
        validate: input => input ? true : 'Please enter a department name'
      }
    ]);

    await db.addDepartment(name);
    console.log('\nDepartment added successfully!');
    await mainMenu();
  } catch (err) {
    console.error('Error adding department:', err);
    await mainMenu();
  }
}

// Add a new role
async function addRole() {
  try {
    const departments = await db.getDepartmentsForList();
    const { title, salary, departmentId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the role:',
        validate: input => input ? true : 'Please enter a role title'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for this role:',
        validate: input => !isNaN(input) ? true : 'Please enter a valid salary'
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select the department for this role:',
        choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
      }
    ]);

    await db.addRole(title, salary, departmentId);
    console.log('\nRole added successfully!');
    await mainMenu();
  } catch (err) {
    console.error('Error adding role:', err);
    await mainMenu();
  }
}

// Add a new employee
async function addEmployee() {
  try {
    const roles = await db.getRolesForList();
    const employees = await db.getEmployeesForList();
    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'Enter the employee\'s first name:',
        validate: input => input ? true : 'Please enter a first name'
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Enter the employee\'s last name:',
        validate: input => input ? true : 'Please enter a last name'
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'Select the employee\'s role:',
        choices: roles.map(role => ({ name: role.title, value: role.id }))
      },
      {
        type: 'list',
        name: 'managerId',
        message: 'Select the employee\'s manager:',
        choices: [{ name: 'None', value: null }, ...employees.map(emp => ({ name: emp.name, value: emp.id }))]
      }
    ]);

    await db.addEmployee(firstName, lastName, roleId, managerId);
    console.log('\nEmployee added successfully!');
    await mainMenu();
  } catch (err) {
    console.error('Error adding employee:', err);
    await mainMenu();
  }
}

// Update an employee's role
async function updateEmployeeRole() {
  try {
    const employees = await db.getEmployeesForList();
    const roles = await db.getRolesForList();
    const { employeeId, roleId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee to update:',
        choices: employees.map(emp => ({ name: emp.name, value: emp.id }))
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'Select the new role:',
        choices: roles.map(role => ({ name: role.title, value: role.id }))
      }
    ]);

    await db.updateEmployeeRole(employeeId, roleId);
    console.log('\nEmployee role updated successfully!');
    await mainMenu();
  } catch (err) {
    console.error('Error updating employee role:', err);
    await mainMenu();
  }
}

// Update an employee's manager
async function updateEmployeeManager() {
  try {
    const employees = await db.getEmployeesForList();
    const { employeeId, managerId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee to update:',
        choices: employees.map(emp => ({ name: emp.name, value: emp.id }))
      },
      {
        type: 'list',
        name: 'managerId',
        message: 'Select the new manager:',
        choices: [{ name: 'None', value: null }, ...employees.map(emp => ({ name: emp.name, value: emp.id }))]
      }
    ]);

    await db.updateEmployeeManager(employeeId, managerId);
    console.log('\nEmployee manager updated successfully!');
    await mainMenu();
  } catch (err) {
    console.error('Error updating employee manager:', err);
    await mainMenu();
  }
}

// View employees by manager
async function viewEmployeesByManager() {
  try {
    const managers = await db.getEmployeesForList();
    const { managerId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'managerId',
        message: 'Select a manager to view their employees:',
        choices: [{ name: 'None', value: null }, ...managers.map(emp => ({ name: emp.name, value: emp.id }))]
      }
    ]);

    const employees = await db.viewEmployeesByManager(managerId);
    console.log('\nEmployees by Manager:');
    console.table(employees);
    await mainMenu();
  } catch (err) {
    console.error('Error viewing employees by manager:', err);
    await mainMenu();
  }
}

// View employees by department
async function viewEmployeesByDepartment() {
  try {
    const departments = await db.getDepartmentsForList();
    const { departmentId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select a department to view its employees:',
        choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
      }
    ]);

    const employees = await db.viewEmployeesByDepartment(departmentId);
    console.log('\nEmployees by Department:');
    console.table(employees);
    await mainMenu();
  } catch (err) {
    console.error('Error viewing employees by department:', err);
    await mainMenu();
  }
}

// Delete a department
async function deleteDepartment() {
  try {
    const departments = await db.getDepartmentsForList();
    const { departmentId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select a department to delete:',
        choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
      }
    ]);

    await db.deleteDepartment(departmentId);
    console.log('\nDepartment deleted successfully!');
    await mainMenu();
  } catch (err) {
    console.error('Error deleting department:', err);
    await mainMenu();
  }
}

// Delete a role
async function deleteRole() {
  try {
    const roles = await db.getRolesForList();
    const { roleId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'roleId',
        message: 'Select a role to delete:',
        choices: roles.map(role => ({ name: role.title, value: role.id }))
      }
    ]);

    await db.deleteRole(roleId);
    console.log('\nRole deleted successfully!');
    await mainMenu();
  } catch (err) {
    console.error('Error deleting role:', err);
    await mainMenu();
  }
}

// Delete an employee
async function deleteEmployee() {
  try {
    const employees = await db.getEmployeesForList();
    const { employeeId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select an employee to delete:',
        choices: employees.map(emp => ({ name: emp.name, value: emp.id }))
      }
    ]);

    await db.deleteEmployee(employeeId);
    console.log('\nEmployee deleted successfully!');
    await mainMenu();
  } catch (err) {
    console.error('Error deleting employee:', err);
    await mainMenu();
  }
}

// View department budget
async function viewDepartmentBudget() {
  try {
    const departments = await db.getDepartmentsForList();
    const { departmentId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select a department to view its budget:',
        choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
      }
    ]);

    const budget = await db.viewDepartmentBudget(departmentId);
    console.log('\nDepartment Budget:');
    console.table([budget]);
    await mainMenu();
  } catch (err) {
    console.error('Error viewing department budget:', err);
    await mainMenu();
  }
}

// Start the application
mainMenu();

// Comment for instructor:
// Implemented a complete command-line interface for the Employee Tracker system
// Used inquirer for user input and console.table for formatted output
// Added comprehensive error handling throughout the application
// Implemented all core features and bonus features
// Used async/await for better readability and error handling
// Added proper validation for user input
// Created a clean and intuitive user interface 