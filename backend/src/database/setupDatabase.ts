import mysql from 'mysql2/promise';
import { createDatabase, createTables } from './createDatabaseScripts';

export async function setupDatabase() {
    let connection: mysql.Connection | undefined;

    try {
        // Create connection without database selected
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        console.log('Connected to MySQL server');

        // Create database
        await connection.query(createDatabase);
        console.log('Database created or already exists');

        // Use the database
        await connection.query('USE c4p');

        // Create tables
        const tables: string[] = createTables.split(';').filter((table: string) => table.trim());
        
        for (const table of tables) {
            if (table.trim()) {
                await connection.query(table);
                console.log('Table created successfully');
            }
        }

        console.log('All tables created successfully');

    } catch (error) {
        console.error('Error setting up database:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed');
        }
    }
}
