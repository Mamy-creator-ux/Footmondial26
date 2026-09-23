const express = require('express');
const db = require('../config/db');
const { computeTopScorers } = require('../utils/standings');

const router = express.Router();

// GET /api/stats - Vue d'ensemble du championnat
router.get('/', (req, res) => {
  const matches = db.get('matches').value();
  const termines = matches.filter(m => m.status === 'terminé');
  const totalButs = termines.reduce((acc, m) => acc + (m.scoreDomicile || 0) + (m.scoreExterieur || 0), 0);
  const events = db.get('events').value();

  res.json({
    totalEquipes: db.get('teams').size().value(),
    totalJoueurs: db.get('players').size().value(),
    totalMatchsJoues: termines.length,
    totalMatchsProgrammes: matches.length,
    totalButs,
    moyenneButsParMatch: termines.length ? +(totalButs / termines.length).toFixed(2) : 0,
    totalCartonsJaunes: events.filter(e => e.type === 'carton_jaune').length,
    totalCartonsRouges: events.filter(e => e.type === 'carton_rouge').length,
    meilleurButeur: computeTopScorers()[0] || null
  });
});

module.exports = router;
