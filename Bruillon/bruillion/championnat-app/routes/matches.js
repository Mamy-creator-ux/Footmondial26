const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');
const { creerNotification } = require('../utils/notifications');

const router = express.Router();

// GET /api/matches?groupe=A&statut=à venir&equipeId=...&date=2026-06-11
router.get('/', (req, res) => {
  let matches = db.get('matches').value();
  const { groupe, statut, equipeId, date, stadeId } = req.query;

  const teams = db.get('teams').value();
  const enrichi = matches.map(m => ({
    ...m,
    equipeDomicile: teams.find(t => t.id === m.equipeDomicileId),
    equipeExterieur: teams.find(t => t.id === m.equipeExterieurId)
  }));

  let resultat = enrichi;
  if (groupe) resultat = resultat.filter(m => m.equipeDomicile?.groupe === groupe.toUpperCase() || m.equipeExterieur?.groupe === groupe.toUpperCase());
  if (statut) resultat = resultat.filter(m => m.status === statut);
  if (equipeId) resultat = resultat.filter(m => m.equipeDomicileId === equipeId || m.equipeExterieurId === equipeId);
  if (date) resultat = resultat.filter(m => m.date === date);
  if (stadeId) resultat = resultat.filter(m => m.stadeId === stadeId);

  resultat.sort((a, b) => new Date(a.date + 'T' + (a.heure || '00:00')) - new Date(b.date + 'T' + (b.heure || '00:00')));
  res.json(resultat);
});

// GET /api/matches/:id (avec buts/cartons détaillés)
router.get('/:id', (req, res) => {
  const match = db.get('matches').find({ id: req.params.id }).value();
  if (!match) return res.status(404).json({ message: "Match introuvable." });
  const evenements = db.get('events').filter({ matchId: match.id }).value();
  res.json({ ...match, evenements });
});

// POST /api/matches - Admin : programmer un match
router.post('/', requireAuth, requireRole('admin'), (req, res) => {
  const { equipeDomicileId, equipeExterieurId, date, heure, stadeId, arbitreId, phase } = req.body;
  if (!equipeDomicileId || !equipeExterieurId || !date) {
    return res.status(400).json({ message: "Équipes et date requises." });
  }
  const match = {
    id: uuidv4(),
    equipeDomicileId,
    equipeExterieurId,
    date, heure: heure || '18:00',
    stadeId: stadeId || null,
    arbitreId: arbitreId || null,
    phase: phase || 'Phase de groupes',
    status: 'à venir',
    scoreDomicile: null,
    scoreExterieur: null
  };
  db.get('matches').push(match).write();

  // notification aux visiteurs / abonnés
  creerNotification(`Nouveau match programmé le ${date} à ${heure || '18:00'}.`, 'calendrier');

  res.status(201).json(match);
});

// PUT /api/matches/:id - Admin : modifier programmation
router.put('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const match = db.get('matches').find({ id: req.params.id });
  if (!match.value()) return res.status(404).json({ message: "Match introuvable." });
  match.assign(req.body).write();
  res.json(match.value());
});

// PUT /api/matches/:id/resultat - Admin/Arbitre : saisir le score final
router.put('/:id/resultat', requireAuth, requireRole('admin', 'arbitre'), (req, res) => {
  const { scoreDomicile, scoreExterieur } = req.body;
  const match = db.get('matches').find({ id: req.params.id });
  if (!match.value()) return res.status(404).json({ message: "Match introuvable." });

  match.assign({
    scoreDomicile: Number(scoreDomicile),
    scoreExterieur: Number(scoreExterieur),
    status: 'terminé'
  }).write();

  const m = match.value();
  const teams = db.get('teams').value();
  const home = teams.find(t => t.id === m.equipeDomicileId)?.nom;
  const away = teams.find(t => t.id === m.equipeExterieurId)?.nom;
  creerNotification(`Résultat final : ${home} ${scoreDomicile} - ${scoreExterieur} ${away}.`, 'resultat');

  res.json(m);
});

// POST /api/matches/:id/evenement - Ajouter but / carton jaune / carton rouge
router.post('/:id/evenement', requireAuth, requireRole('admin', 'arbitre'), (req, res) => {
  const { type, joueurId, minute } = req.body; // type: but | carton_jaune | carton_rouge
  if (!['but', 'carton_jaune', 'carton_rouge'].includes(type)) {
    return res.status(400).json({ message: "Type d'événement invalide." });
  }
  const match = db.get('matches').find({ id: req.params.id }).value();
  if (!match) return res.status(404).json({ message: "Match introuvable." });

  const event = { id: uuidv4(), matchId: match.id, joueurId, type, minute: minute || 0 };
  db.get('events').push(event).write();

  const player = db.get('players').find({ id: joueurId }).value();
  if (type === 'but' && player) {
    creerNotification(`⚽ But de ${player.nom} à la ${minute}e minute !`, 'but');
  }

  res.status(201).json(event);
});

// DELETE /api/matches/:id - Admin
router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  db.get('matches').remove({ id: req.params.id }).write();
  db.get('events').remove({ matchId: req.params.id }).write();
  res.json({ message: "Match supprimé." });
});

module.exports = router;
