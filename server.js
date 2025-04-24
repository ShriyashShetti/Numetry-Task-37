// server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const PORT = 9090;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'shriyash27@',
  database: 'journal_app',
});

db.connect((err) => {
  if (err) console.error('DB Error:', err);
  else console.log('MySQL Connected');
});

// Add new journal entry
app.post('/journal', (req, res) => {
  const { user_id, title, content } = req.body;
  const sql = 'INSERT INTO journal_entries (user_id, title, content, created_at) VALUES (?, ?, ?, NOW())';
  db.query(sql, [user_id, title, content], (err) => {
    if (err) return res.status(500).send(err);
    res.send('Entry added');
  });
});

// Get all entries for user
app.get('/journal/:user_id', (req, res) => {
  const { user_id } = req.params;
  db.query('SELECT * FROM journal_entries WHERE user_id = ?', [user_id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// Get a single entry
app.get('/journal/entry/:id', (req, res) => {
  db.query('SELECT * FROM journal_entries WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result[0]);
  });
});

// Update journal entry
app.put('/journal/:id', (req, res) => {
  const { title, content } = req.body;
  db.query('UPDATE journal_entries SET title = ?, content = ? WHERE id = ?', [title, content, req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.send('Entry updated');
  });
});

// Delete journal entry
app.delete('/journal/:id', (req, res) => {
  db.query('DELETE FROM journal_entries WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.send('Entry deleted');
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

