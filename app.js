const express = require('express');
const app = express();
const todoRoutes = require('./routes/tododb.js');
require('dotenv').config();
const port = process.env.PORT;
const expressLayout = require('express-ejs-layouts')
const db = require('./database/db')
//pertemuan7 session dan bycrpt
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const { isAuthenticated } = require('./middlewares/middleware.js');

app.use(expressLayout);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/todos', todoRoutes);
app.set('view engine', 'ejs');

// Konfigurasi express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set ke true jika menggunakan HTTPS
}));

app.use('/', authRoutes);

app.use((req, res, next) => {
    res.locals.noLayout = false; // Default tidak ada layout
    next();
});

app.get('/login', (req, res) => {
    res.render('login', { noLayout: true });
});

app.get('/signup', (req, res) => {
    res.render('signup', { noLayout: true });
});  

app.get('/', isAuthenticated, (req, res) => {
    res.render('index', {
        layout: 'layouts/main-layout'
    });
});

app.get('/contact', isAuthenticated, (req, res) => {
    res.render('contact', {
        layout: 'layouts/main-layout'
    });
});

app.get('/todo-view', isAuthenticated, (req, res) => {
    db.query('SELECT * FROM todos', (err, todos) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.render('todo', {
            layout: 'layouts/main-layout',
            todos: todos
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});