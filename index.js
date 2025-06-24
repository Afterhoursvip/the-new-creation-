const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// In-memory data (replace with DB in production)
let posts = [];
let users = [];
let comments = [];
let categories = [];
let settings = { title: 'the new creation', description: 'A modern blog platform.' };

// Posts endpoints
app.get('/api/posts', (req, res) => res.json(posts));
app.post('/api/posts', (req, res) => {
  const post = { id: Date.now(), ...req.body };
  posts.unshift(post);
  res.status(201).json(post);
});
app.delete('/api/posts/:id', (req, res) => {
  posts = posts.filter(p => p.id !== Number(req.params.id));
  res.sendStatus(204);
});

// Users endpoints
app.get('/api/users', (req, res) => res.json(users));
app.post('/api/users', (req, res) => {
  const user = { id: Date.now(), ...req.body };
  users.push(user);
  res.status(201).json(user);
});
app.delete('/api/users/:id', (req, res) => {
  users = users.filter(u => u.id !== Number(req.params.id));
  res.sendStatus(204);
});

// Comments endpoints
app.get('/api/comments', (req, res) => res.json(comments));
app.post('/api/comments', (req, res) => {
  const comment = { id: Date.now(), ...req.body };
  comments.push(comment);
  res.status(201).json(comment);
});
app.patch('/api/comments/:id', (req, res) => {
  comments = comments.map(c => c.id === Number(req.params.id) ? { ...c, ...req.body } : c);
  res.json(comments.find(c => c.id === Number(req.params.id)));
});
app.delete('/api/comments/:id', (req, res) => {
  comments = comments.filter(c => c.id !== Number(req.params.id));
  res.sendStatus(204);
});

// Categories endpoints
app.get('/api/categories', (req, res) => res.json(categories));
app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  if (!categories.includes(name)) categories.push(name);
  res.status(201).json({ name });
});
app.delete('/api/categories/:name', (req, res) => {
  categories = categories.filter(c => c !== req.params.name);
  res.sendStatus(204);
});

// Settings endpoints
app.get('/api/settings', (req, res) => res.json(settings));
app.patch('/api/settings', (req, res) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
});

app.listen(PORT, () => console.log(`Backend API running on http://localhost:${PORT}`));
