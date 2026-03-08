const LotMaty = require('../models/lotMaty.model');

const lotMatyController = {
  async getAll(req, res) {
    try {
      const items = await LotMaty.getAll();
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const item = await LotMaty.getById(parseInt(req.params.id));
      if (!item) return res.status(404).json({ error: 'Enregistrement non trouvé' });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getByLot(req, res) {
    try {
      const items = await LotMaty.getByLot(parseInt(req.params.idLot));
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const item = await LotMaty.create(req.body);
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const item = await LotMaty.update(parseInt(req.params.id), req.body);
      if (!item) return res.status(404).json({ error: 'Enregistrement non trouvé' });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await LotMaty.delete(parseInt(req.params.id));
      res.json({ message: 'Enregistrement supprimé' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = lotMatyController;
