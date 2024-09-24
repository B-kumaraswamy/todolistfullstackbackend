import sqlite3 from 'sqlite3';

let db;

export const initDb = () => {
  db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to the SQLite database.');

      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT,
        email TEXT,
        password TEXT,
        phoneNumber TEXT,
        gender TEXT
      )`, (err) => {
        if (err) {
          console.error('Error creating users table:', err.message);
        } else {
          console.log('Users table ready.');
          printTableSchema();
        }
      });
    }
  });
};

const printTableSchema = () => {
  db.all("PRAGMA table_info(users)", [], (err, rows) => {
    if (err) {
      console.error('Error retrieving table schema:', err.message);
    } else {
      console.log('Users table schema:', rows);
    }
  });
};

export const getDb = () => db;