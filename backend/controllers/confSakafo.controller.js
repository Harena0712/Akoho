const ConfSakafo = require('../models/confSakafo.model');

const confSakafoController = {
  async getAll(req, res) {
    try {
      const items = await ConfSakafo.getAll();
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const item = await ConfSakafo.getById(parseInt(req.params.id));
      if (!item) return res.status(404).json({ error: 'Configuration non trouvée' });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getByRace(req, res) {
    try {
      const items = await ConfSakafo.getByRace(parseInt(req.params.idRace));
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const item = await ConfSakafo.create(req.body);
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const item = await ConfSakafo.update(parseInt(req.params.id), req.body);
      if (!item) return res.status(404).json({ error: 'Configuration non trouvée' });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await ConfSakafo.delete(parseInt(req.params.id));
      res.json({ message: 'Configuration supprimée' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = confSakafoController;
