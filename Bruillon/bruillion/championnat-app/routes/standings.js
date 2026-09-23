const express = require('express');
const { computeStandings, computeTopScorers } = require('../utils/standings');

const router = express.Router();

// GET /api/standings?groupe=A - Classement automatique
router.get('/', (req, res) => {
  const { groupe } = req.query;
  res.json(computeStandings(groupe || null));
});

// GET /api/standings/buteurs - Classement des meilleurs buteurs
router.get('/buteurs', (req, res) => {
  res.json(computeTopScorers());
});

module.exports = router;
