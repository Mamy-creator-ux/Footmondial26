# Guide de déploiement — FIFA26 / Control
### GitHub → Supabase → Cloudflare Pages, étape par étape

---

## ÉTAPE 1 — Déposer le code sur GitHub

**Pourquoi :** GitHub sert de source unique du projet ; Cloudflare et vous-même pourrez récupérer le code depuis là.

1. Ouvrez un terminal à la racine du projet (le dossier qui contient `app/`, `server/`, etc.)
2. Initialisez le dépôt Git local :
   ```bash
   git init
   git add .
   git commit -m "Initial commit — FIFA26 / Control"
   ```
3. Allez sur [github.com](https://github.com) → bouton **New repository** → donnez-lui un nom (ex. `fifa26-control`) → **ne cochez rien** (pas de README, pas de .gitignore, pour éviter un conflit avec ce que vous avez déjà) → **Create repository**.
4. GitHub vous affiche une URL du type `https://github.com/votre-compte/fifa26-control.git`. Reliez votre dépôt local à ce dépôt distant :
   ```bash
   git branch -M main
   git remote add origin https://github.com/votre-compte/fifa26-control.git
   git push -u origin main
   ```
5. Rafraîchissez la page GitHub : vous devez voir tous vos fichiers (`app/`, `server/`, `README.md`...). `node_modules/` et `.env` ne doivent **pas** apparaître (ils sont exclus par `.gitignore`).

---

## ÉTAPE 2 — Créer le projet Supabase (la base de données)

**Pourquoi :** Supabase héberge la base PostgreSQL qui contient toutes les données (équipes, matchs, joueurs, classement...).

1. Allez sur [supabase.com](https://supabase.com) → **Start your project** → connectez-vous (GitHub par exemple).
2. Cliquez **New project** :
   - Choisissez une organisation (ou créez-en une)
   - **Name** : `fifa26-control` (ou ce que vous voulez)
   - **Database Password** : générez-en un fort et **notez-le quelque part** — vous en aurez besoin à l'étape 4
   - **Region** : choisissez la plus proche de vous
   - Cliquez **Create new project**
3. Patientez 1 à 2 minutes pendant que Supabase provisionne votre base.

---

## ÉTAPE 3 — Récupérer les clés Supabase

**Pourquoi :** votre API Express et votre frontend ont besoin de ces informations pour se connecter à Supabase.

1. Dans votre projet Supabase, allez dans **Project Settings** (icône ⚙️ en bas à gauche) → **Database**.
2. Cherchez la section **Connection string** → onglet **URI**. Vous voyez quelque chose comme :
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```
   Copiez-la, puis remplacez `[YOUR-PASSWORD]` par le mot de passe noté à l'étape 2. **Gardez cette ligne de côté** — c'est votre `DATABASE_URL`.
   *(En production, préférez le mode "Transaction pooler", affiché juste au-dessus, port `6543` — plus robuste face à de nombreuses petites requêtes.)*
3. Toujours dans **Project Settings**, allez dans **API**. Copiez :
   - **Project URL** (ex. `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public** (une longue clé) sous "Project API keys"

Vous avez maintenant 3 informations notées : `DATABASE_URL`, l'URL du projet, et la clé `anon`.

---

## ÉTAPE 4 — Configurer et démarrer l'API Express

**Pourquoi :** c'est l'étape qui crée les tables dans Supabase et remplit les données (équipes, groupes, stades...).

1. Dans le terminal, allez dans le dossier `server` :
   ```bash
   cd server
   cp .env.example .env
   ```
2. Ouvrez `server/.env` dans un éditeur de texte et remplissez :
   ```
   DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   JWT_SECRET=une-longue-chaine-aleatoire
   ```
   *(pour générer le `JWT_SECRET` : `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`)*
3. Installez les dépendances puis lancez le seed :
   ```bash
   npm install
   npm run seed
   ```
   Ceci crée automatiquement toutes les tables dans Supabase, puis insère les 12 groupes, 48 équipes, 16 stades, 20 arbitres, les effectifs et un compte organisateur.
4. Démarrez l'API :
   ```bash
   npm run dev
   ```
5. Vérifiez que ça fonctionne : ouvrez `http://localhost:4000/api` dans votre navigateur — vous devez voir un JSON listant les routes.
6. **Important :** laissez ce terminal ouvert, l'API doit continuer à tourner pour que le site fonctionne (voir note en fin de document).

---

## ÉTAPE 5 — Configurer le frontend

**Pourquoi :** le frontend a besoin de savoir où se trouve votre API et votre projet Supabase.

1. Ouvrez un **second terminal**, à la racine du projet (pas dans `server/`) :
   ```bash
   cp .env.example .env.local
   ```
2. Ouvrez `.env.local` et remplissez avec les valeurs de l'étape 3 :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

---

## ÉTAPE 6 — Générer le site statique

**Pourquoi :** Cloudflare Pages accueille des fichiers, pas du code source à compiler — il faut donc construire le site à l'avance.

1. Installez les dépendances et lancez le build :
   ```bash
   npm install
   npm run build
   ```
2. Un dossier **`out/`** apparaît à la racine du projet. C'est votre site complet (HTML/CSS/JS), prêt à être mis en ligne tel quel.
3. Vous pouvez le prévisualiser localement avant d'envoyer quoi que ce soit :
   ```bash
   npm run preview
   ```

---

## ÉTAPE 7 — Créer le projet Cloudflare Pages

1. Allez sur [dash.cloudflare.com](https://dash.cloudflare.com) → connectez-vous ou créez un compte.
2. Dans le menu de gauche, cliquez **Workers & Pages**.
3. Cliquez **Create application** → onglet **Pages** → **Upload assets**.
4. Donnez un nom à votre projet (ex. `fifa26-control`) — cela déterminera l'URL finale : `https://fifa26-control.pages.dev`.

---

## ÉTAPE 8 — Téléverser le dossier et publier

1. Une zone de glisser-déposer apparaît. **Glissez le dossier `out/`** (ou ouvrez-le et glissez tout son contenu) dans cette zone.
2. Cliquez **Deploy site**. Cloudflare met le site en ligne en quelques secondes.
3. Vous obtenez votre URL finale, ex. `https://fifa26-control.pages.dev`. Ouvrez-la : le site doit s'afficher.

---

## ÉTAPE 9 — Relier les deux (dernière étape critique)

**Pourquoi :** par sécurité, votre API refuse par défaut les requêtes venant d'une origine inconnue.

1. Retournez dans `server/.env` et modifiez :
   ```
   CORS_ORIGIN=https://fifa26-control.pages.dev
   ```
2. Redémarrez l'API (`Ctrl+C` puis `npm run dev` à nouveau).
3. Rechargez votre site Cloudflare : le calendrier, le classement et les statistiques doivent maintenant se charger avec les vraies données. Si une bannière rouge « API indisponible » apparaît, c'est que cette étape n'est pas correcte ou que l'API n'est pas démarrée.

---

## Mettre à jour le site plus tard

Uniquement les étapes 6 et 8 sont à refaire :
```bash
npm run build
```
puis sur Cloudflare : votre projet → **Deployments** → **Create deployment** → **Upload assets** → redéposez `out/`.

---

## Note importante

L'étape 4 (l'API Express) doit rester allumée en permanence pour que le site
fonctionne — Cloudflare Pages n'héberge que des fichiers statiques, pas de
processus Node.js. Gardez donc ce terminal ouvert, ou faites tourner
`server/` sur une machine que vous laissez allumée (votre PC, un serveur de
l'école, etc.).
