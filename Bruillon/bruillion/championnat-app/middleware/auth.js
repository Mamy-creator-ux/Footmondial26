const jwt = require('jsonwebtoken');
require('dotenv').config();

// Vérifie que la requête contient un token JWT valide
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Accès refusé : token manquant." });
  }
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role, name, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
}

// Vérifie que l'utilisateur possède l'un des rôles autorisés
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé : droits insuffisants." });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
