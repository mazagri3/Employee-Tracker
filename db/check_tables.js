const { Pool } = require('pg');
require('dotenv').config();

async function checkTables() {
    const pool = new Pool({
        connectionString: process.env.DB_URL
    });

    try {
        // Check if tables exist
        const tables = ['department', 'role', 'employee'];
        for (const table of tables) {
            const res = await pool.query(
                `SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = $1
                )`,
                [table]
            );
            console.log(`Table ${table} exists:`, res.rows[0].exists);
            
            if (res.rows[0].exists) {
                // Get table structure
                const structure = await pool.query(
                    `SELECT column_name, data_type 
                     FROM information_schema.columns 
                     WHERE table_name = $1`,
                    [table]
                );
                console.log(`Structure of ${table}:`, structure.rows);
                
                // Get row count
                const count = await pool.query(`SELECT COUNT(*) FROM ${table}`);
                console.log(`Number of rows in ${table}:`, count.rows[0].count);
            }
        }
    } catch (err) {
        console.error('Error checking tables:', err);
    } finally {
        await pool.end();
    }
}

checkTables(); 