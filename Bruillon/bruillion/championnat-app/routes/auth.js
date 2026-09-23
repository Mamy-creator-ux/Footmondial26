const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
require('dotenv').config();

const router = express.Router();

// POST /api/auth/register - Inscription
router.post('/register', async (req, res) => {
  const { nom, email, motDePasse, role } = req.body;
  if (!nom || !email || !motDePasse) {
    return res.status(400).json({ message: "Nom, email et mot de passe sont requis." });
  }
  const existant = db.get('users').find({ email }).value();
  if (existant) {
    return res.status(409).json({ message: "Un compte existe déjà avec cet email." });
  }

  const hash = await bcrypt.hash(motDePasse, 10);
  const user = {
    id: uuidv4(),
    nom,
    email,
    motDePasse: hash,
    role: role && ['admin', 'entraineur', 'arbitre', 'visiteur'].includes(role) ? role : 'visiteur',
    creeLe: new Date().toISOString()
  };
  db.get('users').push(user).write();

  const token = jwt.sign(
    { id: user.id, role: user.role, nom: user.nom, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.status(201).json({
    message: "Inscription réussie.",
    token,
    user: { id: user.id, nom: user.nom, email: user.email, role: user.role }
  });
});

// POST /api/auth/login - Connexion
router.post('/login', async (req, res) => {
  const { email, motDePasse } = req.body;
  const user = db.get('users').find({ email }).value();
  if (!user) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect." });
  }
  const valide = await bcrypt.compare(motDePasse, user.motDePasse);
  if (!valide) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect." });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, nom: user.nom, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.json({
    message: "Connexion réussie.",
    token,
    user: { id: user.id, nom: user.nom, email: user.email, role: user.role }
  });
});

module.exports = router;
