# Football World 2026

Application full-stack de gestion/suivi d'un championnat de football.

## Installation
1. Installer Node.js LTS.
2. Dans ce dossier :
   npm install
3. Démarrer :
   npm start
4. Ouvrir http://localhost:3000

La base SQLite `data/football.db` est créée automatiquement.

## API
GET /api/teams
GET /api/players
GET /api/matches
GET /api/standings
GET /api/stats
GET /api/stadiums
POST /api/auth/register
POST /api/auth/login

## Données 2026
Le projet est conçu pour recevoir les données officielles du tournoi. Les données seed incluses sont volontairement minimales afin d'éviter de présenter des données non vérifiées comme officielles. Consultez FIFA pour les résultats et données officielles à jour.
