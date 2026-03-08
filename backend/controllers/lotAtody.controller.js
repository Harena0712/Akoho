const LotAtody = require('../models/lotAtody.model');

const lotAtodyController = {
  async getAll(req, res) {
    try {
      const items = await LotAtody.getAll();
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const item = await LotAtody.getById(parseInt(req.params.id));
      if (!item) return res.status(404).json({ error: 'Enregistrement non trouvé' });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getByLot(req, res) {
    try {
      const items = await LotAtody.getByLot(parseInt(req.params.idLot));
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const item = await LotAtody.create(req.body);
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const item = await LotAtody.update(parseInt(req.params.id), req.body);
      if (!item) return res.status(404).json({ error: 'Enregistrement non trouvé' });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await LotAtody.delete(parseInt(req.params.id));
      res.json({ message: 'Enregistrement supprimé' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = lotAtodyController;
