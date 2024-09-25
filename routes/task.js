import express from 'express';
import { getDb } from '../database.js';

const taskRouter = express.Router();

// Get all tasks
taskRouter.get('/', (req, res) => {
  const db = getDb();
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ tasks: rows });
  });
});

// Add a new task
taskRouter.post('/', (req, res) => {
  const db = getDb();
  const { name, status } = req.body;
  db.run('INSERT INTO tasks (name, status) VALUES (?, ?)', [name, status], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// Update a task's name and status
taskRouter.put('/:id', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { name, status } = req.body;
  db.run('UPDATE tasks SET name = ?, status = ? WHERE id = ?', [name, status, id], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ updated: this.changes });
  });
});

// Delete a task
taskRouter.delete('/:id', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', id, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
});

export default taskRouter;