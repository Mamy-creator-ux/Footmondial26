const express = require('express');
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/notifications - Liste des notifications (les plus récentes en premier)
router.get('/', (req, res) => {
  const notifs = db.get('notifications').orderBy('creeLe', 'desc').take(30).value();
  res.json(notifs);
});

// PUT /api/notifications/:id/lue - Marquer comme lue
router.put('/:id/lue', requireAuth, (req, res) => {
  const notif = db.get('notifications').find({ id: req.params.id });
  if (!notif.value()) return res.status(404).json({ message: "Notification introuvable." });
  notif.assign({ lue: true }).write();
  res.json(notif.value());
});

module.exports = router;
