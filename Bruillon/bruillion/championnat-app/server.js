const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes API REST
app.use('/api/auth', require('./routes/auth'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/players', require('./routes/players'));
app.use('/api/coaches', require('./routes/coaches'));
app.use('/api/referees', require('./routes/referees'));
app.use('/api/stadiums', require('./routes/stadiums'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/standings', require('./routes/standings'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/users', require('./routes/users'));

app.get('/api', (req, res) => {
  res.json({ message: "API Championnat Mondial 2026 opérationnelle." });
});

// Route catch-all -> sert l'application frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
