const db = require('../config/db');

/**
 * Calcule le classement automatique à partir des matchs terminés.
 * Règles : Victoire = 3 pts, Nul = 1 pt, Défaite = 0 pt.
 * Tri : points > différence de buts > buts marqués > nom d'équipe.
 */
function computeStandings(groupe = null) {
  const teams = db.get('teams').value();
  const matches = db.get('matches')
    .filter(m => m.status === 'terminé')
    .value();

  const table = {};
  teams.forEach(team => {
    if (groupe && team.groupe !== groupe) return;
    table[team.id] = {
      teamId: team.id,
      nom: team.nom,
      drapeau: team.drapeau,
      groupe: team.groupe,
      joues: 0,
      victoires: 0,
      nuls: 0,
      defaites: 0,
      buteMarques: 0,
      butsEncaisses: 0,
      diffButs: 0,
      points: 0
    };
  });

  matches.forEach(match => {
    const home = table[match.equipeDomicileId];
    const away = table[match.equipeExterieurId];
    if (!home || !away) return;

    const scoreHome = match.scoreDomicile ?? 0;
    const scoreAway = match.scoreExterieur ?? 0;

    home.joues++; away.joues++;
    home.buteMarques += scoreHome; home.butsEncaisses += scoreAway;
    away.buteMarques += scoreAway; away.butsEncaisses += scoreHome;

    if (scoreHome > scoreAway) {
      home.victoires++; home.points += 3;
      away.defaites++;
    } else if (scoreHome < scoreAway) {
      away.victoires++; away.points += 3;
      home.defaites++;
    } else {
      home.nuls++; away.nuls++;
      home.points += 1; away.points += 1;
    }
  });

  const classement = Object.values(table).map(t => ({
    ...t,
    diffButs: t.buteMarques - t.butsEncaisses
  }));

  classement.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.diffButs !== a.diffButs) return b.diffButs - a.diffButs;
    if (b.buteMarques !== a.buteMarques) return b.buteMarques - a.buteMarques;
    return a.nom.localeCompare(b.nom);
  });

  classement.forEach((t, i) => (t.rang = i + 1));
  return classement;
}

/** Calcule le classement des buteurs à partir des événements de type "but" */
function computeTopScorers() {
  const players = db.get('players').value();
  const events = db.get('events').filter({ type: 'but' }).value();

  const goals = {};
  events.forEach(ev => {
    goals[ev.joueurId] = (goals[ev.joueurId] || 0) + 1;
  });

  return Object.entries(goals)
    .map(([joueurId, buts]) => {
      const player = players.find(p => p.id === joueurId);
      if (!player) return null;
      return {
        joueurId,
        nom: player.nom,
        equipeId: player.equipeId,
        poste: player.poste,
        buts
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.buts - a.buts);
}

module.exports = { computeStandings, computeTopScorers };
