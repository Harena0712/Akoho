const express = require('express');
const cors = require('cors');
const { getPool } = require('./config/db');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/race', require('./routes/race.routes'));
app.use('/api/lot', require('./routes/lot.routes'));
app.use('/api/lot-maty', require('./routes/lotMaty.routes'));
app.use('/api/lot-atody', require('./routes/lotAtody.routes'));
app.use('/api/conf-sakafo', require('./routes/confSakafo.routes'));
app.use('/api/incubation', require('./routes/incubation.routes'));
app.use('/api/situation', require('./routes/situation.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Akoho API is running' });
});

// Démarrage
async function start() {
  try {
    await getPool();
    console.log('Connecté à SQL Server (AkohoDB)');

    app.listen(PORT, () => {
      console.log(`Akoho API démarrée sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Erreur de connexion à la base de données:', err.message);
    process.exit(1);
  }
}

start();
