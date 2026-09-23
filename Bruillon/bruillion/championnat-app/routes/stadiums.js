const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => res.json(db.get('stadiums').value()));

router.get('/:id', (req, res) => {
  const stadium = db.get('stadiums').find({ id: req.params.id }).value();
  if (!stadium) return res.status(404).json({ message: "Stade introuvable." });
  res.json(stadium);
});

router.post('/', requireAuth, requireRole('admin'), (req, res) => {
  const { nom, ville, pays, capacite } = req.body;
  if (!nom || !ville) return res.status(400).json({ message: "Nom et ville requis." });
  const stadium = { id: uuidv4(), nom, ville, pays: pays || '', capacite: capacite || 0 };
  db.get('stadiums').push(stadium).write();
  res.status(201).json(stadium);
});

router.put('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const stadium = db.get('stadiums').find({ id: req.params.id });
  if (!stadium.value()) return res.status(404).json({ message: "Stade introuvable." });
  stadium.assign(req.body).write();
  res.json(stadium.value());
});

router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  db.get('stadiums').remove({ id: req.params.id }).write();
  res.json({ message: "Stade supprimé." });
});

module.exports = router;
