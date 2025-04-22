const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool
const pool = new Pool({
    connectionString: process.env.DB_URL
});

async function initializeDatabase() {
    try {
        // Read the schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Execute the schema
        await pool.query(schema);
        console.log('Database initialized successfully!');
    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        await pool.end();
    }
}

// Run the initialization
initializeDatabase(); 