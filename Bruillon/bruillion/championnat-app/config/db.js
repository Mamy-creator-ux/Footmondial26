const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const adapter = new FileSync(path.join(__dirname, '..', 'data', 'db.json'));
const db = low(adapter);

// Structure par défaut de la base de données
db.defaults({
  users: [],        // comptes utilisateurs (admin, entraineur, arbitre, visiteur)
  teams: [],         // équipes
  players: [],        // joueurs
  coaches: [],        // entraineurs
  referees: [],        // arbitres
  stadiums: [],        // stades
  matches: [],        // calendrier + résultats
  events: [],        // buts, cartons (liés à un match)
  notifications: []     // notifications utilisateurs
}).write();

module.exports = db;
