const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

function createToken(user) {
  return jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!name || String(name).trim().length < 2) {
    return res.status(400).json({ message: 'Please enter your name.' });
  }
  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }
  if (!password || String(password).length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  try {
    const passwordHash = bcrypt.hashSync(password, 10);
    const result = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(String(name).trim(), normalizedEmail, passwordHash);
    const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ token: createToken(user), user });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ message: 'An account with that email already exists.' });
    }
    return res.status(500).json({ message: 'Unable to create your account.' });
  }
});

router.post('/login', (req, res) => {
  const normalizedEmail = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ message: 'Email or password is incorrect.' });
  }

  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  return res.json({ token: createToken(safeUser), user: safeUser });
});

module.exports = router;
