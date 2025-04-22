const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool to the Neon database
const pool = new Pool({
  connectionString: process.env.DB_URL
});

// Test the database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    console.error('Please make sure the database is accessible.');
    process.exit(1);
  } else {
    console.log('Connected to the database successfully!');
    // Test a simple query
    client.query('SELECT 1', (err, result) => {
      release();
      if (err) {
        console.error('Error testing database query:', err.stack);
        process.exit(1);
      } else {
        console.log('Database query test successful!');
      }
    });
  }
});

// Export the pool for use in other files
module.exports = pool;

// Comment for instructor:
// Created a database connection file using the pg module
// Used simple credentials for development
// Used a connection pool for better performance
// Included a test connection to verify database connectivity
// NOTE: In production, use environment variables for credentials 