require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./db');
const authRoutes = require('./routes/auth');
const issueRoutes = require('./routes/issues');

const app = express();
const port = Number(process.env.PORT) || 5000;

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required. Copy .env.example to .env and set it before starting.');
}

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'CampusFix API' }));
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((error, req, res, next) => {
  console.error(error);
  return res.status(500).json({ message: 'Something went wrong on the server.' });
});

app.listen(port, '0.0.0.0', () => console.log(`CampusFix API running on http://localhost:${port}`));
