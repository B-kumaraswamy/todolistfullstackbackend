import express from 'express';
import bcrypt from 'bcrypt';
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
router.post('/', async (req, res) => {
  const db = getDb();
  const { username, email, password, phoneNumber, gender } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (username, email, password, phoneNumber, gender) VALUES (?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, phoneNumber, gender],
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
  } catch (error) {
    console.error('Error hashing password:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;