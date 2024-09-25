import express from 'express';
import jwt from 'jsonwebtoken';
import { getDb } from '../database.js';

const profileRouter = express.Router();

// Secret key for JWT
const JWT_SECRET = 'your_secret_key';

// Profile endpoint
profileRouter.get('/', (req, res) => {
    console.log("req from frontend in profile router", req.headers)
  const token = req.headers.authorization?.split(' ')[1];
  console.log("token from the frontend", token)
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const db = getDb();
    db.get('SELECT username, email, password, phoneNumber, gender FROM users WHERE id = ?', [decoded.id], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    });
  });
});

profileRouter.put('/', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
  
      const { username, email, phoneNumber, gender } = req.body;
      const db = getDb();
      db.run(
        'UPDATE users SET username = ?, email = ?, phoneNumber = ?, gender = ? WHERE id = ?',
        [username, email, phoneNumber, gender, decoded.id],
        function (err) {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({ success: true });
        }
      );
    });
  });

export default profileRouter;