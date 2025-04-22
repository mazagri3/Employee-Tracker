const { Pool } = require('pg');

// Create a connection pool to the PostgreSQL database
const pool = new Pool({
  user: 'postgres',     // default PostgreSQL user
  password: 'root', // default PostgreSQL password
  host: 'localhost',    // PostgreSQL host
  port: 5432,           // PostgreSQL port
  database: 'employee_tracker' // database name
});

// Test the database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Connected to the database successfully!');
    release();
  }
});

// Export the pool for use in other files
module.exports = pool;

// Comment for instructor:
// Created a database connection file using the pg module
// Used a connection pool for better performance
// Included a test connection to verify database connectivity
// NOTE: You may need to update the user and password values to match your local PostgreSQL configuration 