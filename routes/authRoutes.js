const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database/db');
const router = express.Router();

// Route Signup
router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).send('Error hashing password');

        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err, result) => {
            if (err) return res.status(500).send('Error registering user');
            res.redirect('/login');
        });
    });
});

// Route untuk menampilkan form signup
router.get('/signup', (req, res) => {
    res.render('signup', {
        layout: 'layouts/main-layout'
    });
});

// Route Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).send('Error fetching user');
        if (results.length === 0) return res.status(400).send('User not found');

        bcrypt.compare(password, results[0].password, (err, isMatch) => {
            if (err) return res.status(500).send('Error checking password');
            if (!isMatch) return res.status(401).send('Incorrect password');

            // Simpan userId dalam sesi setelah login berhasil
            req.session.userId = results[0].id;
            res.redirect('/'); // Arahkan ke halaman utama setelah login
        });
    });
});

// Route untuk menampilkan form login
router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'layouts/main-layout'
    });
});

// Route Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error logging out');
        res.redirect('/login'); // Arahkan ke halaman login setelah logout
    });
});

// Add Todo Route
router.post('/todos', (req, res) => {
    const { task } = req.body;

    if (!task) {
        return res.status(400).send('Task is required');
    }

    db.query('INSERT INTO todos (task) VALUES (?)', [task], (err, result) => {
        if (err) {
            return res.status(500).send('Error adding todo');
        }
        res.status(201).json({
            id: result.insertId,
            task: task,
            completed: false
        });
    });
});

// Get all Todos Route
router.get('/todos', (req, res) => {
    db.query('SELECT * FROM todos', (err, results) => {
        if (err) return res.status(500).send('Error fetching todos');
        res.status(200).json(results);
    });
});

module.exports = router;