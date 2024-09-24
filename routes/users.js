import express from 'express';
import { getDb } from '../database.js';

const router = express.Router();

// Endpoint to get all users
router.get('/', (req, res) => {
  const db = getDb();
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      console.error('Error fetching users:', err.message);
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ users: rows });
  });
});

// Endpoint to add a new user
router.post('/', (req, res) => {
  const db = getDb();
  const { username, email, password, phoneNumber, gender } = req.body;
  db.run(
    `INSERT INTO users (username, email, password, phoneNumber, gender) VALUES (?, ?, ?, ?, ?)`,
    [username, email, password, phoneNumber, gender],
    function(err) {
      if (err) {
        console.error('Error inserting user:', err.message);
        res.status(400).json({ error: err.message });
        return;
      }
      console.log('User added successfully:', { userId: this.lastID });
      res.json({ userId: this.lastID });
    }
  );
});

export default router;