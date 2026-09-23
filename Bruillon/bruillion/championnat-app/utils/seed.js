/**
 * Script de génération des données réelles de la Coupe du Monde FIFA 2026™
 * Tirage au sort officiel : 5 décembre 2025, Washington D.C.
 * Compétition : 11 juin - 19 juillet 2026, aux États-Unis, au Canada et au Mexique
 * 48 équipes, 12 groupes (A à L), 16 stades.
 */
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

// ---------- STADES OFFICIELS (16) ----------
const stadiumsData = [
  { nom: 'Estadio Azteca', ville: 'Mexico', pays: 'Mexique', capacite: 87523 },
  { nom: 'Estadio Akron', ville: 'Guadalajara', pays: 'Mexique', capacite: 48071 },
  { nom: 'Estadio BBVA', ville: 'Monterrey', pays: 'Mexique', capacite: 53500 },
  { nom: 'BC Place', ville: 'Vancouver', pays: 'Canada', capacite: 54500 },
  { nom: 'BMO Field', ville: 'Toronto', pays: 'Canada', capacite: 45736 },
  { nom: 'MetLife Stadium', ville: 'East Rutherford (New York/New Jersey)', pays: 'États-Unis', capacite: 82500 },
  { nom: 'Mercedes-Benz Stadium', ville: 'Atlanta', pays: 'États-Unis', capacite: 71000 },
  { nom: 'Gillette Stadium', ville: 'Boston', pays: 'États-Unis', capacite: 65878 },
  { nom: 'AT&T Stadium', ville: 'Dallas', pays: 'États-Unis', capacite: 94000 },
  { nom: 'NRG Stadium', ville: 'Houston', pays: 'États-Unis', capacite: 72220 },
  { nom: 'Arrowhead Stadium', ville: 'Kansas City', pays: 'États-Unis', capacite: 76416 },
  { nom: 'SoFi Stadium', ville: 'Los Angeles', pays: 'États-Unis', capacite: 70240 },
  { nom: 'Hard Rock Stadium', ville: 'Miami', pays: 'États-Unis', capacite: 64767 },
  { nom: 'Lincoln Financial Field', ville: 'Philadelphie', pays: 'États-Unis', capacite: 69796 },
  { nom: "Levi's Stadium", ville: 'San Francisco Bay Area', pays: 'États-Unis', capacite: 68500 },
  { nom: 'Lumen Field', ville: 'Seattle', pays: 'États-Unis', capacite: 69000 }
];

// ---------- GROUPES OFFICIELS (12 groupes de 4, tirage du 5/12/2025) ----------
const groupsData = {
  A: ['Mexique', 'Afrique du Sud', 'Corée du Sud', 'République tchèque'],
  B: ['Canada', 'Bosnie-Herzégovine', 'Qatar', 'Suisse'],
  C: ['Brésil', 'Maroc', 'Haïti', 'Écosse'],
  D: ['États-Unis', 'Paraguay', 'Australie', 'Turquie'],
  E: ['Allemagne', 'Curaçao', "Côte d'Ivoire", 'Équateur'],
  F: ['Pays-Bas', 'Japon', 'Suède', 'Tunisie'],
  G: ['Belgique', 'Égypte', 'Iran', 'Nouvelle-Zélande'],
  H: ['Espagne', 'Cap-Vert', 'Arabie saoudite', 'Uruguay'],
  I: ['France', 'Sénégal', 'Irak', 'Norvège'],
  J: ['Argentine', 'Algérie', 'Autriche', 'Jordanie'],
  K: ['Portugal', 'Ouzbékistan', 'Colombie', 'RD Congo'],
  L: ['Angleterre', 'Croatie', 'Ghana', 'Panama']
};

// Quelques stars réelles par sélection (données publiques notoires), pour peupler
// des effectifs représentatifs (liste non exhaustive)
const starPlayers = {
  France: [['Kylian Mbappé', 'Attaquant', 10], ['Ousmane Dembélé', 'Attaquant', 11], ['Aurélien Tchouaméni', 'Milieu', 8]],
  Sénégal: [['Sadio Mané', 'Attaquant', 10], ['Kalidou Koulibaly', 'Défenseur', 3]],
  Norvège: [['Erling Haaland', 'Attaquant', 9], ['Martin Ødegaard', 'Milieu', 8]],
  Irak: [['Aymen Hussein', 'Attaquant', 9]],
  Argentine: [['Lionel Messi', 'Attaquant', 10], ['Julián Álvarez', 'Attaquant', 9]],
  Brésil: [['Vinícius Júnior', 'Attaquant', 7], ['Rodrygo', 'Attaquant', 11]],
  Portugal: [['Cristiano Ronaldo', 'Attaquant', 7]],
  Espagne: [['Lamine Yamal', 'Attaquant', 19]],
  Angleterre: [['Harry Kane', 'Attaquant', 9], ['Jude Bellingham', 'Milieu', 10]],
  Allemagne: [['Jamal Musiala', 'Milieu', 10]],
  'Pays-Bas': [['Cody Gakpo', 'Attaquant', 7]],
  Belgique: [['Kevin De Bruyne', 'Milieu', 7]],
  Maroc: [['Achraf Hakimi', 'Défenseur', 2]],
  Croatie: [['Luka Modrić', 'Milieu', 10]],
  Canada: [['Alphonso Davies', 'Défenseur', 19]],
  'États-Unis': [['Christian Pulisic', 'Attaquant', 10]],
  Mexique: [['Santiago Giménez', 'Attaquant', 9]]
};

const postes = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant'];
function nomGenerique(pays, i) { return `Joueur ${pays.slice(0, 3).toUpperCase()}-${i}`; }

function run() {
  console.log('🌱 Initialisation des données réelles de la Coupe du Monde 2026...');

  // Réinitialise la base
  db.set('users', []).write();
  db.set('teams', []).write();
  db.set('players', []).write();
  db.set('coaches', []).write();
  db.set('referees', []).write();
  db.set('stadiums', []).write();
  db.set('matches', []).write();
  db.set('events', []).write();
  db.set('notifications', []).write();

  // --- Stades ---
  const stadiums = stadiumsData.map(s => ({ id: uuidv4(), ...s }));
  db.set('stadiums', stadiums).write();

  // --- Équipes + joueurs ---
  const teamsByName = {};
  Object.entries(groupsData).forEach(([groupe, teams]) => {
    teams.forEach(nom => {
      const team = { id: uuidv4(), nom, groupe, drapeau: '', confederation: '' };
      db.get('teams').push(team).write();
      teamsByName[nom] = team;

      // Effectif : stars connues + joueurs génériques pour compléter à ~15
      const squad = [];
      (starPlayers[nom] || []).forEach(([joueurNom, poste, numero]) => {
        squad.push({ id: uuidv4(), nom: joueurNom, equipeId: team.id, poste, numero, dateNaissance: null });
      });
      for (let i = squad.length; i < 15; i++) {
        const poste = postes[i % postes.length];
        squad.push({ id: uuidv4(), nom: nomGenerique(nom, i + 1), equipeId: team.id, poste, numero: i + 1, dateNaissance: null });
      }
      db.set('players', [...db.get('players').value(), ...squad]).write();
    });
  });

  // --- Arbitres (arbitres internationaux reconnus de la FIFA) ---
  const refereesData = [
    { nom: 'Szymon Marciniak', nationalite: 'Pologne', role: 'arbitre central' },
    { nom: 'Clément Turpin', nationalite: 'France', role: 'arbitre central' },
    { nom: 'Michael Oliver', nationalite: 'Angleterre', role: 'arbitre central' },
    { nom: 'István Kovács', nationalite: 'Roumanie', role: 'arbitre central' },
    { nom: 'Facundo Tello', nationalite: 'Argentine', role: 'arbitre central' },
    { nom: 'Ismail Elfath', nationalite: 'États-Unis', role: 'arbitre central' }
  ];
  const referees = refereesData.map(r => ({ id: uuidv4(), ...r }));
  db.set('referees', referees).write();

  // --- Match d'ouverture réel : Mexique - Afrique du Sud, 11 juin 2026, Estadio Azteca ---
  const azteca = stadiums.find(s => s.nom === 'Estadio Azteca');
  const metlife = stadiums.find(s => s.nom === 'MetLife Stadium');
  const matches = [];

  matches.push({
    id: uuidv4(),
    equipeDomicileId: teamsByName['Mexique'].id,
    equipeExterieurId: teamsByName['Afrique du Sud'].id,
    date: '2026-06-11', heure: '20:00',
    stadeId: azteca.id, arbitreId: referees[0].id,
    phase: 'Phase de groupes - Groupe A', status: 'à venir',
    scoreDomicile: null, scoreExterieur: null
  });

  // Quelques affiches réelles du Groupe I (France) programmées
  matches.push({
    id: uuidv4(),
    equipeDomicileId: teamsByName['France'].id,
    equipeExterieurId: teamsByName['Sénégal'].id,
    date: '2026-06-16', heure: '18:00',
    stadeId: metlife.id, arbitreId: referees[1].id,
    phase: 'Phase de groupes - Groupe I', status: 'à venir',
    scoreDomicile: null, scoreExterieur: null
  });

  matches.push({
    id: uuidv4(),
    equipeDomicileId: teamsByName['Norvège'].id,
    equipeExterieurId: teamsByName['France'].id,
    date: '2026-06-22', heure: '15:00',
    stadeId: stadiums.find(s => s.ville === 'Philadelphie').id, arbitreId: referees[2].id,
    phase: 'Phase de groupes - Groupe I', status: 'à venir',
    scoreDomicile: null, scoreExterieur: null
  });

  // Une rencontre déjà "terminée" pour démontrer classement/statistiques
  const matchTermine = {
    id: uuidv4(),
    equipeDomicileId: teamsByName['Argentine'].id,
    equipeExterieurId: teamsByName['Algérie'].id,
    date: '2026-06-13', heure: '17:00',
    stadeId: stadiums.find(s => s.ville === 'Miami').id, arbitreId: referees[3].id,
    phase: 'Phase de groupes - Groupe J', status: 'terminé',
    scoreDomicile: 2, scoreExterieur: 0
  };
  matches.push(matchTermine);

  db.set('matches', matches).write();

  // Événements du match terminé (buts) pour peupler le classement des buteurs
  const messi = db.get('players').find({ equipeId: teamsByName['Argentine'].id, nom: 'Lionel Messi' }).value();
  if (messi) {
    db.get('events').push(
      { id: uuidv4(), matchId: matchTermine.id, joueurId: messi.id, type: 'but', minute: 23 },
      { id: uuidv4(), matchId: matchTermine.id, joueurId: messi.id, type: 'but', minute: 67 }
    ).write();
  }

  // --- Comptes utilisateurs de démonstration ---
  const passHash = bcrypt.hashSync('motdepasse123', 10);
  db.get('users').push(
    { id: uuidv4(), nom: 'Administrateur FIFA', email: 'admin@championnat2026.com', motDePasse: passHash, role: 'admin', creeLe: new Date().toISOString() },
    { id: uuidv4(), nom: 'Visiteur Test', email: 'visiteur@championnat2026.com', motDePasse: passHash, role: 'visiteur', creeLe: new Date().toISOString() }
  ).write();

  console.log('✅ Données réelles insérées : 48 équipes / 12 groupes / 16 stades officiels.');
  console.log('   Compte admin : admin@championnat2026.com / motdepasse123');
  console.log('   Compte visiteur : visiteur@championnat2026.com / motdepasse123');
}

run();
