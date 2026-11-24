require('dotenv').config({ quiet: true });
const { Client } = require('pg');

const createDatabase = async () => {
    const dbName = process.env.DB_NAME;
    const client = new Client({
        host     : process.env.DB_HOST,
        port     : Number(process.env.DB_PORT),
        user     : process.env.DB_USER_NAME,
        password : process.env.DB_USER_PASSWORD,
        database : 'postgres',
    });

    await client.connect();
    const result = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (result.rowCount === 0) {
        await client.query(`CREATE DATABASE "${dbName}"`);
        console.log(`Database ${dbName} created`);
    } else {
        console.log(`Database ${dbName} already exists`);
    }
    await client.end();
};

createDatabase().catch((error) => {
    console.error('Unable to create database: ' + error.message);
    process.exit(1);
});
