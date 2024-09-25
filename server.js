import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users.js';
import { initDb } from './database.js';
import loginRouter from './routes/login.js';
import taskRouter from './routes/task.js';
import profileRouter from './routes/profile.js';

const app = express();
const PORT = 8080;
console.log("In server.js");
// Initialize database
initDb();

// Middleware
app.use(cors());
app.use(express.json());

// Use the users router
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/tasks', taskRouter);
app.use('/profile', profileRouter)

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});