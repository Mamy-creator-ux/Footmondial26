# 🏆 Mondial 2026 — Plateforme de gestion de championnat

Application complète de gestion d'un championnat de football, basée sur les
**données réelles de la Coupe du Monde FIFA 2026™** (tirage au sort officiel
du 5 décembre 2025, 48 équipes, 12 groupes, 16 stades, du 11 juin au
19 juillet 2026, aux États-Unis, au Canada et au Mexique).

## Stack technique

- **Back-end** : Node.js, Express, API REST, JWT (authentification), bcrypt
  (hachage des mots de passe), lowdb (base de données JSON fichier — aucune
  installation de SGBD nécessaire).
- **Front-end** : HTML / CSS / JavaScript natif (sans framework), Fetch API,
  mise à jour dynamique sans rechargement de page.

## Installation

```bash
cd championnat-app
npm install
npm run seed     # peuple la base avec les données réelles (équipes, stades, arbitres…)
npm start        # démarre le serveur sur http://localhost:4000
```

Pour le développement (rechargement automatique) :
```bash
npm run dev
```

Ouvrez ensuite **http://localhost:4000** dans votre navigateur.

## Comptes de démonstration

| Rôle       | Email                          | Mot de passe     |
|------------|---------------------------------|------------------|
| Admin      | admin@championnat2026.com       | motdepasse123    |
| Visiteur   | visiteur@championnat2026.com    | motdepasse123    |

Vous pouvez aussi créer un compte via la page d'inscription (rôles : visiteur,
entraineur, arbitre — le rôle admin est réservé, à attribuer manuellement en
base ou via un autre compte admin).

## Fonctionnalités

### Gestion (back-office / espace administrateur)
- Gestion des équipes (CRUD), joueurs, entraineurs, arbitres, stades
- Programmation du calendrier des matchs
- Saisie des résultats, buts, cartons jaunes/rouges
- Gestion des comptes utilisateurs et des rôles

### Côté public
- Inscription / connexion (JWT)
- Liste des équipes avec recherche et filtre par groupe
- Fiche équipe (effectif, entraineur)
- Calendrier interactif (onglets à venir / terminés, filtres par groupe,
  équipe, date)
- Fiche match (score, buts, cartons)
- **Classement automatique** par groupe (3 pts / 1 pt / 0 pt, départage par
  différence de buts puis buts marqués)
- Statistiques du championnat et **meilleur buteur**
- Notifications (nouveau match programmé, but marqué, résultat final)

## Structure du projet

```
championnat-app/
├── server.js              # point d'entrée Express
├── config/db.js           # connexion lowdb
├── middleware/auth.js     # JWT + contrôle des rôles
├── routes/                # toutes les routes de l'API REST
├── utils/
│   ├── standings.js       # calcul automatique du classement et des buteurs
│   ├── notifications.js
│   └── seed.js            # données réelles de la Coupe du Monde 2026
├── data/db.json           # base de données (générée par le seed)
└── public/                # front-end (HTML / CSS / JS)
    ├── index.html, equipes.html, equipe.html, calendrier.html,
    │   match.html, classement.html, statistiques.html,
    │   connexion.html, inscription.html, admin.html
    ├── css/style.css
    └── js/api.js           # wrapper Fetch API + gestion du token + header dynamique
```

## API REST — endpoints principaux

| Méthode | Route                              | Description                              | Accès          |
|---------|--------------------------------------|-------------------------------------------|----------------|
| POST    | /api/auth/register                   | Inscription                                | Public         |
| POST    | /api/auth/login                      | Connexion                                  | Public         |
| GET     | /api/teams?groupe=&recherche=        | Liste des équipes (filtres)                | Public         |
| GET     | /api/teams/:id                       | Détail équipe (effectif, entraineur)       | Public         |
| POST/PUT/DELETE /api/teams            | Gestion des équipes                        | Admin          |
| GET     | /api/players?equipeId=&poste=        | Liste des joueurs (filtres) + stats        | Public         |
| GET     | /api/matches?statut=&groupe=&date=   | Calendrier (filtres)                       | Public         |
| POST    | /api/matches                         | Programmer un match                        | Admin          |
| PUT     | /api/matches/:id/resultat            | Saisir le score final                      | Admin / Arbitre|
| POST    | /api/matches/:id/evenement           | Ajouter un but / carton                    | Admin / Arbitre|
| GET     | /api/standings?groupe=               | Classement automatique                     | Public         |
| GET     | /api/standings/buteurs               | Meilleurs buteurs                          | Public         |
| GET     | /api/stats                           | Statistiques globales                      | Public         |
| GET     | /api/notifications                   | Dernières notifications                    | Public         |
| GET     | /api/users (Admin) / /api/users/me   | Gestion des comptes                        | Admin / Connecté |

## Notes sur les données

Les équipes, groupes et stades reflètent les informations publiques réelles
disponibles au moment de la rédaction (tirage au sort du 5 décembre 2025,
barrages intercontinentaux et européens de mars 2026). Les effectifs
contiennent quelques joueurs réels notoires et des joueurs génériques pour
compléter chaque groupe à des fins de démonstration — à vous de compléter les
effectifs complets via l'espace administrateur si besoin.
