const Race = require('../models/race.model');

const raceController = {
  async getAll(req, res) {
    try {
      const races = await Race.getAll();
      res.json(races);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const race = await Race.getById(parseInt(req.params.id));
      if (!race) return res.status(404).json({ error: 'Race non trouvée' });
      res.json(race);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const race = await Race.create(req.body);
      res.status(201).json(race);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const race = await Race.update(parseInt(req.params.id), req.body);
      if (!race) return res.status(404).json({ error: 'Race non trouvée' });
      res.json(race);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await Race.delete(parseInt(req.params.id));
      res.json({ message: 'Race supprimée' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = raceController;
