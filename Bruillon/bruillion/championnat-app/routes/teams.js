const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/teams?groupe=A&recherche=fra
router.get('/', (req, res) => {
  let teams = db.get('teams').value();
  const { groupe, recherche } = req.query;

  if (groupe) teams = teams.filter(t => t.groupe === groupe.toUpperCase());
  if (recherche) {
    const q = recherche.toLowerCase();
    teams = teams.filter(t => t.nom.toLowerCase().includes(q));
  }
  res.json(teams);
});

// GET /api/teams/:id
router.get('/:id', (req, res) => {
  const team = db.get('teams').find({ id: req.params.id }).value();
  if (!team) return res.status(404).json({ message: "Équipe introuvable." });
  const joueurs = db.get('players').filter({ equipeId: team.id }).value();
  const entraineur = db.get('coaches').find({ equipeId: team.id }).value();
  res.json({ ...team, joueurs, entraineur });
});

// POST /api/teams - Admin uniquement
router.post('/', requireAuth, requireRole('admin'), (req, res) => {
  const { nom, groupe, drapeau, confederation } = req.body;
  if (!nom || !groupe) return res.status(400).json({ message: "Nom et groupe requis." });
  const team = { id: uuidv4(), nom, groupe: groupe.toUpperCase(), drapeau: drapeau || '', confederation: confederation || '' };
  db.get('teams').push(team).write();
  res.status(201).json(team);
});

// PUT /api/teams/:id - Admin uniquement
router.put('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const team = db.get('teams').find({ id: req.params.id });
  if (!team.value()) return res.status(404).json({ message: "Équipe introuvable." });
  team.assign(req.body).write();
  res.json(team.value());
});

// DELETE /api/teams/:id - Admin uniquement
router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  db.get('teams').remove({ id: req.params.id }).write();
  res.json({ message: "Équipe supprimée." });
});

module.exports = router;
