const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(db.get('coaches').value());
});

router.get('/:id', (req, res) => {
  const coach = db.get('coaches').find({ id: req.params.id }).value();
  if (!coach) return res.status(404).json({ message: "Entraineur introuvable." });
  res.json(coach);
});

router.post('/', requireAuth, requireRole('admin'), (req, res) => {
  const { nom, equipeId, nationalite } = req.body;
  if (!nom || !equipeId) return res.status(400).json({ message: "Nom et équipe requis." });
  const coach = { id: uuidv4(), nom, equipeId, nationalite: nationalite || '' };
  db.get('coaches').push(coach).write();
  res.status(201).json(coach);
});

router.put('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const coach = db.get('coaches').find({ id: req.params.id });
  if (!coach.value()) return res.status(404).json({ message: "Entraineur introuvable." });
  coach.assign(req.body).write();
  res.json(coach.value());
});

router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  db.get('coaches').remove({ id: req.params.id }).write();
  res.json({ message: "Entraineur supprimé." });
});

module.exports = router;
