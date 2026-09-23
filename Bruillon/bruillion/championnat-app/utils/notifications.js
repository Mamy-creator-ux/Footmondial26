const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

function creerNotification(message, type = 'info') {
  const notif = {
    id: uuidv4(),
    message,
    type,
    creeLe: new Date().toISOString(),
    lue: false
  };
  db.get('notifications').push(notif).write();
  return notif;
}

module.exports = { creerNotification };
