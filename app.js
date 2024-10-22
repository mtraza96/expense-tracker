const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const transactionsRoutes = require('./routes/transactions');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database('./db/database.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Database connected');

        // Create transactions table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            date TEXT NOT NULL,
            description TEXT
        )`);

        // Create categories table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL
        )`);
    }
});

// Define a simple GET route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Personal Expense Tracker API!');
});

// Use transactions routes
app.use('/api', transactionsRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Expense tracker API running at http://localhost:${port}`);
});
