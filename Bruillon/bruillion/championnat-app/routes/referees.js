const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => res.json(db.get('referees').value()));

router.get('/:id', (req, res) => {
  const referee = db.get('referees').find({ id: req.params.id }).value();
  if (!referee) return res.status(404).json({ message: "Arbitre introuvable." });
  res.json(referee);
});

router.post('/', requireAuth, requireRole('admin'), (req, res) => {
  const { nom, nationalite, role } = req.body;
  if (!nom) return res.status(400).json({ message: "Nom requis." });
  const referee = { id: uuidv4(), nom, nationalite: nationalite || '', role: role || 'arbitre central' };
  db.get('referees').push(referee).write();
  res.status(201).json(referee);
});

router.put('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const referee = db.get('referees').find({ id: req.params.id });
  if (!referee.value()) return res.status(404).json({ message: "Arbitre introuvable." });
  referee.assign(req.body).write();
  res.json(referee.value());
});

router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  db.get('referees').remove({ id: req.params.id }).write();
  res.json({ message: "Arbitre supprimé." });
});

module.exports = router;
