const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const auth = require('./middleware');

const app = express();
app.use(cors());
app.use(express.json());

/* ---------- AUTH ---------- */

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  try {
    const result = db.prepare(
      "INSERT INTO users (email, password) VALUES (?, ?)"
    ).run(email, hash);

    const token = jwt.sign({ id: result.lastInsertRowid }, "secret");
    res.json({ token });
  } catch {
    res.status(400).json({ error: "User exists" });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare(
    "SELECT * FROM users WHERE email = ?"
  ).get(email);

  if (!user) return res.status(400).json({ error: "Invalid" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid" });

  const token = jwt.sign({ id: user.id }, "secret");
  res.json({ token });
});

/* ---------- TRANSACTIONS ---------- */

app.post('/transactions', auth, (req, res) => {
  const { amount, type, category, description } = req.body;

  db.prepare(`
    INSERT INTO transactions (user_id, type, amount, category, date, description)
    VALUES (?, ?, ?, ?, DATE('now'), ?)
  `).run(req.user.id, type, amount, category, description);

  res.json({ success: true });
});

app.get('/transactions', auth, (req, res) => {
  const data = db.prepare(
    "SELECT * FROM transactions WHERE user_id = ?"
  ).all(req.user.id);

  res.json(data);
});

/* ---------- ANALYTICS ---------- */

app.get('/summary', auth, (req, res) => {
  const data = db.prepare(
    "SELECT * FROM transactions WHERE user_id = ?"
  ).all(req.user.id);

  let income = 0, expense = 0;

  data.forEach(t => {
    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  });

  res.json({
    income,
    expense,
    savings: income - expense,
    savingsRate: income ? ((income - expense)/income)*100 : 0
  });
});

app.listen(5000, () => console.log("Backend running on 5000"));