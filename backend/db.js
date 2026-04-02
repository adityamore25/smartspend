const Database = require('better-sqlite3');
const db = new Database('data.db');

db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT
)`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  type TEXT,
  amount REAL,
  category TEXT,
  date TEXT,
  description TEXT
)`).run();

module.exports = db;