const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/players?equipeId=...&poste=...&recherche=...
router.get('/', (req, res) => {
  let players = db.get('players').value();
  const { equipeId, poste, recherche } = req.query;

  if (equipeId) players = players.filter(p => p.equipeId === equipeId);
  if (poste) players = players.filter(p => p.poste === poste);
  if (recherche) {
    const q = recherche.toLowerCase();
    players = players.filter(p => p.nom.toLowerCase().includes(q));
  }

  // Ajoute les statistiques calculées (buts, cartons)
  const events = db.get('events').value();
  players = players.map(p => {
    const buts = events.filter(e => e.joueurId === p.id && e.type === 'but').length;
    const cartonsJaunes = events.filter(e => e.joueurId === p.id && e.type === 'carton_jaune').length;
    const cartonsRouges = events.filter(e => e.joueurId === p.id && e.type === 'carton_rouge').length;
    return { ...p, buts, cartonsJaunes, cartonsRouges };
  });

  res.json(players);
});

// GET /api/players/:id
router.get('/:id', (req, res) => {
  const player = db.get('players').find({ id: req.params.id }).value();
  if (!player) return res.status(404).json({ message: "Joueur introuvable." });
  const events = db.get('events').filter({ joueurId: player.id }).value();
  res.json({ ...player, evenements: events });
});

// POST /api/players - Admin/Entraineur
router.post('/', requireAuth, requireRole('admin', 'entraineur'), (req, res) => {
  const { nom, equipeId, poste, numero, dateNaissance } = req.body;
  if (!nom || !equipeId || !poste) return res.status(400).json({ message: "Nom, équipe et poste requis." });
  const player = { id: uuidv4(), nom, equipeId, poste, numero: numero || null, dateNaissance: dateNaissance || null };
  db.get('players').push(player).write();
  res.status(201).json(player);
});

// PUT /api/players/:id - Admin/Entraineur
router.put('/:id', requireAuth, requireRole('admin', 'entraineur'), (req, res) => {
  const player = db.get('players').find({ id: req.params.id });
  if (!player.value()) return res.status(404).json({ message: "Joueur introuvable." });
  player.assign(req.body).write();
  res.json(player.value());
});

// DELETE /api/players/:id - Admin uniquement
router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  db.get('players').remove({ id: req.params.id }).write();
  res.json({ message: "Joueur supprimé." });
});

module.exports = router;
