const express = require('express');
const router = express.Router();

let todos = [
    {
        id: 1, task: 'Belajar Node.js', completed: false
    },
    {
        id: 2, task: 'Membuat API', completed: false
    },
    {
        id: 3, task: 'Membuat Data Baru', completed: false
    },
];

// Endpoint to get all todos
router.get('/', (req, res) => {
    res.json(todos);
});

// Endpoint to add a new todo (POST method)
router.post('/', (req, res) => {
    const { task } = req.body;

    // Input validation: Ensure task is provided
    if (!task || typeof task !== 'string' || task.trim() === '') {
        return res.status(400).json({ message: 'Task is required and must be a non-empty string.' });
    }

    const newTodo = {
        id: todos.length + 1,  // Assuming IDs are sequential (could be handled differently with a database)
        task: task.trim(),
        completed: false
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// Endpoint to delete a todo by ID
router.delete('/:id', (req, res) => {
    const todoId = parseInt(req.params.id);

    if (isNaN(todoId)) {
        return res.status(400).json({ message: 'Invalid todo ID.' });
    }

    const todoIndex = todos.findIndex(t => t.id === todoId);
    if (todoIndex === -1) {
        return res.status(404).json({ message: 'Tugas tidak ditemukan' });
    }

    const deletedTodo = todos.splice(todoIndex, 1)[0];  // Remove and return the deleted todo
    res.status(200).json({ message: `Tugas '${deletedTodo.task}' telah dihapus` });
});

// Endpoint to update a todo by ID
router.put('/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const { task } = req.body;

    if (isNaN(todoId)) {
        return res.status(400).json({ message: 'Invalid todo ID.' });
    }

    const todo = todos.find(t => t.id === todoId);
    if (!todo) {
        return res.status(404).json({ message: 'Tugas tidak ditemukan' });
    }

    // Input validation: Ensure task is a non-empty string if provided
    if (task && (typeof task !== 'string' || task.trim() === '')) {
        return res.status(400).json({ message: 'Task must be a non-empty string.' });
    }

    todo.task = task ? task.trim() : todo.task; // Update task if provided, else retain the current task
    res.status(200).json({
        message: `Tugas dengan ID: ${todo.id} telah diperbarui`,
        updatedTodo: todo
    });
});

module.exports = router;