const Lot = require('../models/lot.model');

const lotController = {
  async getAll(req, res) {
    try {
      const lots = await Lot.getAll();
      res.json(lots);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const lot = await Lot.getById(parseInt(req.params.id));
      if (!lot) return res.status(404).json({ error: 'Lot non trouvé' });
      res.json(lot);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const lot = await Lot.create(req.body);
      res.status(201).json(lot);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const lot = await Lot.update(parseInt(req.params.id), req.body);
      if (!lot) return res.status(404).json({ error: 'Lot non trouvé' });
      res.json(lot);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await Lot.delete(parseInt(req.params.id));
      res.json({ message: 'Lot supprimé' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = lotController;
