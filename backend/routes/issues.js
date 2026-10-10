const express = require('express');
const db = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const categories = ['Electrical', 'Water', 'Wi-Fi', 'Furniture', 'Other'];
const statuses = ['Pending', 'In Progress', 'Resolved'];
const issueSelect = `
  SELECT issues.*, users.name AS reporter_name, users.email AS reporter_email
  FROM issues JOIN users ON users.id = issues.user_id
`;

function validateIssue(body) {
  const { title, description, category, location } = body;
  if (!title || String(title).trim().length < 3) return 'Title must be at least 3 characters.';
  if (!description || String(description).trim().length < 10) return 'Description must be at least 10 characters.';
  if (!categories.includes(category)) return 'Please choose a valid category.';
  if (!location || String(location).trim().length < 2) return 'Please enter the issue location.';
  return null;
}

router.get('/', (req, res) => {
  const { status } = req.query;
  if (status && !statuses.includes(status)) return res.status(400).json({ message: 'Invalid status filter.' });
  const query = status ? `${issueSelect} WHERE issues.status = ? ORDER BY issues.created_at DESC` : `${issueSelect} ORDER BY issues.created_at DESC`;
  const issues = status ? db.prepare(query).all(status) : db.prepare(query).all();
  return res.json(issues);
});

router.get('/mine', requireAuth, (req, res) => {
  const issues = db.prepare(`${issueSelect} WHERE issues.user_id = ? ORDER BY issues.created_at DESC`).all(req.user.id);
  return res.json(issues);
});

router.get('/:id', (req, res) => {
  const issue = db.prepare(`${issueSelect} WHERE issues.id = ?`).get(req.params.id);
  if (!issue) return res.status(404).json({ message: 'Issue not found.' });
  return res.json(issue);
});

router.post('/', requireAuth, (req, res) => {
  const validationError = validateIssue(req.body);
  if (validationError) return res.status(400).json({ message: validationError });
  const { title, description, category, location, image_uri: imageUri } = req.body;
  const result = db.prepare(`INSERT INTO issues (user_id, title, description, category, location, image_uri) VALUES (?, ?, ?, ?, ?, ?)`).run(req.user.id, String(title).trim(), String(description).trim(), category, String(location).trim(), imageUri || null);
  const issue = db.prepare(`${issueSelect} WHERE issues.id = ?`).get(result.lastInsertRowid);
  return res.status(201).json(issue);
});

router.put('/:id/status', requireAuth, requireAdmin, (req, res) => {
  const { status } = req.body;
  if (!statuses.includes(status)) return res.status(400).json({ message: 'Please choose a valid status.' });
  const result = db.prepare('UPDATE issues SET status = ? WHERE id = ?').run(status, req.params.id);
  if (!result.changes) return res.status(404).json({ message: 'Issue not found.' });
  return res.json(db.prepare(`${issueSelect} WHERE issues.id = ?`).get(req.params.id));
});

router.delete('/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM issues WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  if (!result.changes) return res.status(404).json({ message: 'Issue not found or you are not the owner.' });
  return res.status(204).send();
});

module.exports = router;
