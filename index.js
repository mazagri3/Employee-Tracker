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
      // BONUS cases
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
        console.log('Thank you for using the Employee Tracker System. Goodbye!');
        process.exit(0);
    }
  } catch (err) {
    console.error('Error in main menu:', err);
  }

  // Return to the main menu after completing an action
  setTimeout(() => mainMenu(), 1000);
}

// View all departments function
async function viewAllDepartments() {
  try {
    const departments = await db.viewAllDepartments();
    console.log('\n');
    console.table('All Departments', departments);
  } catch (err) {
    console.error('Error viewing departments:', err);
  }
}

// View all roles function
async function viewAllRoles() {
  try {
    const roles = await db.viewAllRoles();
    console.log('\n');
    console.table('All Roles', roles);
  } catch (err) {
    console.error('Error viewing roles:', err);
  }
}

// View all employees function
async function viewAllEmployees() {
  try {
    const employees = await db.viewAllEmployees();
    console.log('\n');
    console.table('All Employees', employees);
  } catch (err) {
    console.error('Error viewing employees:', err);
  }
}

// Add a department function
async function addDepartment() {
  try {
    const department = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the department?',
        validate: input => input ? true : 'Department name is required.'
      }
    ]);

    await db.addDepartment(department.name);
    console.log(`\nAdded department "${department.name}" to the database.\n`);
  } catch (err) {
    console.error('Error adding department:', err);
  }
}

// Add a role function
async function addRole() {
  try {
    // Get departments for the selection list
    const departments = await db.getDepartmentsForList();
    
    if (departments.length === 0) {
      console.log('\nYou need to add a department first.\n');
      return;
    }

    const role = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the title of the role?',
        validate: input => input ? true : 'Role title is required.'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary for this role?',
        validate: input => {
          const num = parseFloat(input);
          return !isNaN(num) && num > 0 ? true : 'Please enter a valid positive number.';
        }
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Which department does this role belong to?',
        choices: departments.map(dept => ({
          name: dept.name,
          value: dept.id
        }))
      }
    ]);

    await db.addRole(role.title, role.salary, role.departmentId);
    console.log(`\nAdded role "${role.title}" to the database.\n`);
  } catch (err) {
    console.error('Error adding role:', err);
  }
}

// Add an employee function
async function addEmployee() {
  try {
    // Get roles for the selection list
    const roles = await db.getRolesForList();
    
    if (roles.length === 0) {
      console.log('\nYou need to add a role first.\n');
      return;
    }

    // Get employees for manager selection list
    const managers = await db.getEmployeesForList();
    
    // Add a "None" option for employees without a manager
    managers.unshift({ id: null, name: 'None' });

    const employee = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "What is the employee's first name?",
        validate: input => input ? true : 'First name is required.'
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
        validate: input => input ? true : 'Last name is required.'
      },
      {
        type: 'list',
        name: 'roleId',
        message: "What is the employee's role?",
        choices: roles.map(role => ({
          name: role.name,
          value: role.id
        }))
      },
      {
        type: 'list',
        name: 'managerId',
        message: "Who is the employee's manager?",
        choices: managers.map(manager => ({
          name: manager.name,
          value: manager.id
        }))
      }
    ]);

    await db.addEmployee(employee.firstName, employee.lastName, employee.roleId, employee.managerId);
    console.log(`\nAdded ${employee.firstName} ${employee.lastName} to the database.\n`);
  } catch (err) {
    console.error('Error adding employee:', err);
  }
}

// Update an employee's role function
async function updateEmployeeRole() {
  try {
    // Get employees for selection list
    const employees = await db.getEmployeesForList();
    
    if (employees.length === 0) {
      console.log('\nYou need to add employees first.\n');
      return;
    }

    // Get roles for selection list
    const roles = await db.getRolesForList();
    
    if (roles.length === 0) {
      console.log('\nYou need to add roles first.\n');
      return;
    }

    const update = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: "Which employee's role do you want to update?",
        choices: employees.map(employee => ({
          name: employee.name,
          value: employee.id
        }))
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'Which role do you want to assign to the selected employee?',
        choices: roles.map(role => ({
          name: role.name,
          value: role.id
        }))
      }
    ]);

    await db.updateEmployeeRole(update.employeeId, update.roleId);
    console.log('\nUpdated employee role in the database.\n');
  } catch (err) {
    console.error('Error updating employee role:', err);
  }
}

// BONUS: Update employee manager function
async function updateEmployeeManager() {
  try {
    // Get employees for selection list
    const employees = await db.getEmployeesForList();
    
    if (employees.length === 0) {
      console.log('\nYou need to add employees first.\n');
      return;
    }

    const updateManager = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: "Which employee's manager do you want to update?",
        choices: employees.map(employee => ({
          name: employee.name,
          value: employee.id
        }))
      }
    ]);

    // Filter out the selected employee from the managers list
    const managers = employees
      .filter(employee => employee.id !== updateManager.employeeId)
      .map(employee => ({
        name: employee.name,
        value: employee.id
      }));
      
    // Add a "None" option
    managers.unshift({ name: 'None', value: null });

    const { managerId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'managerId',
        message: 'Who is the new manager?',
        choices: managers
      }
    ]);

    await db.updateEmployeeManager(updateManager.employeeId, managerId);
    console.log('\nUpdated employee manager in the database.\n');
  } catch (err) {
    console.error('Error updating employee manager:', err);
  }
}

// BONUS: View employees by manager function
async function viewEmployeesByManager() {
  try {
    // Get employees who are managers
    const managers = await db.getEmployeesForList();
    
    if (managers.length === 0) {
      console.log('\nYou need to add employees first.\n');
      return;
    }

    const { managerId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'managerId',
        message: 'Which manager\'s employees do you want to see?',
        choices: managers.map(manager => ({
          name: manager.name,
          value: manager.id
        }))
      }
    ]);

    const employees = await db.viewEmployeesByManager(managerId);
    console.log('\n');
    
    if (employees.length === 0) {
      console.log('This manager has no employees.');
    } else {
      console.table('Employees by Manager', employees);
    }
  } catch (err) {
    console.error('Error viewing employees by manager:', err);
  }
}

// BONUS: View employees by department function
async function viewEmployeesByDepartment() {
  try {
    // Get departments for selection list
    const departments = await db.getDepartmentsForList();
    
    if (departments.length === 0) {
      console.log('\nYou need to add departments first.\n');
      return;
    }

    const { departmentId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'departmentId',
        message: 'Which department\'s employees do you want to see?',
        choices: departments.map(department => ({
          name: department.name,
          value: department.id
        }))
      }
    ]);

    const employees = await db.viewEmployeesByDepartment(departmentId);
    console.log('\n');
    
    if (employees.length === 0) {
      console.log('This department has no employees.');
    } else {
      console.table('Employees by Department', employees);
    }
  } catch (err) {
    console.error('Error viewing employees by department:', err);
  }
}

// BONUS: Delete department function
async function deleteDepartment() {
  try {
    // Get departments for selection list
    const departments = await db.getDepartmentsForList();
    
    if (departments.length === 0) {
      console.log('\nYou need to add departments first.\n');
      return;
    }

    const { departmentId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'departmentId',
        message: 'Which department do you want to delete?',
        choices: departments.map(department => ({
          name: department.name,
          value: department.id
        }))
      },
      {
        type: 'confirm',
        name: 'confirmDelete',
        message: 'Are you sure you want to delete this department? This will also delete all associated roles and employees.',
        default: false
      }
    ]);

    if (!departmentId.confirmDelete) {
      console.log('\nDeletion cancelled.\n');
      return;
    }

    const department = await db.deleteDepartment(departmentId);
    console.log(`\nDeleted department "${department.name}" from the database.\n`);
  } catch (err) {
    console.error('Error deleting department:', err);
  }
}

// BONUS: Delete role function
async function deleteRole() {
  try {
    // Get roles for selection list
    const roles = await db.getRolesForList();
    
    if (roles.length === 0) {
      console.log('\nYou need to add roles first.\n');
      return;
    }

    const { roleId, confirmDelete } = await inquirer.prompt([
      {
        type: 'list',
        name: 'roleId',
        message: 'Which role do you want to delete?',
        choices: roles.map(role => ({
          name: role.name,
          value: role.id
        }))
      },
      {
        type: 'confirm',
        name: 'confirmDelete',
        message: 'Are you sure you want to delete this role? This will also delete all employees with this role.',
        default: false
      }
    ]);

    if (!confirmDelete) {
      console.log('\nDeletion cancelled.\n');
      return;
    }

    const role = await db.deleteRole(roleId);
    console.log(`\nDeleted role "${role.title}" from the database.\n`);
  } catch (err) {
    console.error('Error deleting role:', err);
  }
}

// BONUS: Delete employee function
async function deleteEmployee() {
  try {
    // Get employees for selection list
    const employees = await db.getEmployeesForList();
    
    if (employees.length === 0) {
      console.log('\nYou need to add employees first.\n');
      return;
    }

    const { employeeId, confirmDelete } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Which employee do you want to delete?',
        choices: employees.map(employee => ({
          name: employee.name,
          value: employee.id
        }))
      },
      {
        type: 'confirm',
        name: 'confirmDelete',
        message: 'Are you sure you want to delete this employee?',
        default: false
      }
    ]);

    if (!confirmDelete) {
      console.log('\nDeletion cancelled.\n');
      return;
    }

    const employee = await db.deleteEmployee(employeeId);
    console.log(`\nDeleted employee "${employee.name}" from the database.\n`);
  } catch (err) {
    console.error('Error deleting employee:', err);
  }
}

// BONUS: View department budget function
async function viewDepartmentBudget() {
  try {
    // Get departments for selection list
    const departments = await db.getDepartmentsForList();
    
    if (departments.length === 0) {
      console.log('\nYou need to add departments first.\n');
      return;
    }

    const { departmentId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'departmentId',
        message: 'Which department\'s budget do you want to see?',
        choices: departments.map(department => ({
          name: department.name,
          value: department.id
        }))
      }
    ]);

    const budget = await db.viewDepartmentBudget(departmentId);
    console.log('\n');
    
    if (!budget) {
      console.log('This department has no employees or budget information.');
    } else {
      console.log(`Total budget for ${budget.department}: $${budget.total_budget.toLocaleString()}`);
    }
  } catch (err) {
    console.error('Error viewing department budget:', err);
  }
}

// Start the application
mainMenu();

// Comment for instructor:
// Created the main index.js file that implements all required functionality
// Used inquirer for user prompts and console.table for formatted display
// Implemented all required features: viewing all departments/roles/employees, adding new data, and updating employees
// Also implemented all BONUS features for additional points
// Added error handling throughout the application
// Created a user-friendly interface with clear prompts and feedback 