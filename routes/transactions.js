const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.db');

// Add a new transaction
router.post('/transactions', (req, res) => {
    const { type, category, amount, date, description } = req.body;
    db.run(`INSERT INTO transactions (type, category, amount, date, description) VALUES (?, ?, ?, ?, ?)`,
        [type, category, amount, date, description],
        function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json({ message: 'Transaction added successfully', id: this.lastID });
        });
});

// Get all transactions
router.get('/transactions', (req, res) => {
    db.all(`SELECT * FROM transactions`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ transactions: rows });
    });
});

// Get a transaction by ID
router.get('/transactions/:id', (req, res) => {
    const id = req.params.id;
    db.get(`SELECT * FROM transactions WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json({ transaction: row });
    });
});

// Update a transaction by ID
router.put('/transactions/:id', (req, res) => {
    const id = req.params.id;
    const { type, category, amount, date, description } = req.body;
    db.run(`UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ?`,
        [type, category, amount, date, description, id],
        function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json({ message: 'Transaction updated successfully' });
        });
});

// Delete a transaction by ID
router.delete('/transactions/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM transactions WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Transaction deleted successfully' });
    });
});

// Get summary of transactions
router.get('/summary', (req, res) => {
    db.all(`SELECT type, SUM(amount) as total FROM transactions GROUP BY type`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        let income = 0;
        let expense = 0;
        rows.forEach(row => {
            if (row.type === 'income') income = row.total;
            if (row.type === 'expense') expense = row.total;
        });
        const balance = income - expense;
        res.json({ income, expense, balance });
    });
});

// Exporting the router
module.exports = router;
