const express = require('express');
const db = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/users - Admin uniquement : liste des comptes
router.get('/', requireAuth, requireRole('admin'), (req, res) => {
  const users = db.get('users').value().map(({ motDePasse, ...u }) => u);
  res.json(users);
});

// GET /api/users/me - Profil de l'utilisateur connecté
router.get('/me', requireAuth, (req, res) => {
  const user = db.get('users').find({ id: req.user.id }).value();
  if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });
  const { motDePasse, ...safe } = user;
  res.json(safe);
});

// PUT /api/users/:id/role - Admin uniquement : changer le rôle d'un utilisateur
router.put('/:id/role', requireAuth, requireRole('admin'), (req, res) => {
  const { role } = req.body;
  if (!['admin', 'entraineur', 'arbitre', 'visiteur'].includes(role)) {
    return res.status(400).json({ message: "Rôle invalide." });
  }
  const user = db.get('users').find({ id: req.params.id });
  if (!user.value()) return res.status(404).json({ message: "Utilisateur introuvable." });
  user.assign({ role }).write();
  const { motDePasse, ...safe } = user.value();
  res.json(safe);
});

// DELETE /api/users/:id - Admin uniquement
router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  db.get('users').remove({ id: req.params.id }).write();
  res.json({ message: "Utilisateur supprimé." });
});

module.exports = router;
