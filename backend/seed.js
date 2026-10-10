require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');

const adminPassword = bcrypt.hashSync('admin123', 10);
const adminResult = db.prepare(`INSERT OR IGNORE INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')`).run('Campus Admin', 'admin@campus.com', adminPassword);
const admin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@campus.com');

const studentPassword = bcrypt.hashSync('student123', 10);
const studentResult = db.prepare(`INSERT OR IGNORE INTO users (name, email, password_hash) VALUES (?, ?, ?)`).run('Demo Student', 'student@campus.com', studentPassword);
const student = db.prepare('SELECT id FROM users WHERE email = ?').get('student@campus.com');

if (db.prepare('SELECT COUNT(*) AS count FROM issues').get().count === 0) {
  const insert = db.prepare('INSERT INTO issues (user_id, title, description, category, location, status) VALUES (?, ?, ?, ?, ?, ?)');
  insert.run(student.id, 'Ceiling fan is not working', 'The ceiling fan in the back row has stopped spinning and the room is very warm.', 'Electrical', 'Science Block, Room 204', 'Pending');
  insert.run(student.id, 'Water dispenser is empty', 'The dispenser near the library entrance has no drinking water.', 'Water', 'Central Library, Ground Floor', 'In Progress');
  insert.run(admin.id, 'Wi-Fi signal is weak', 'The campus Wi-Fi disconnects frequently around the north study area.', 'Wi-Fi', 'North Study Area', 'Resolved');
}

console.log('Seed complete. Admin: admin@campus.com / admin123');
