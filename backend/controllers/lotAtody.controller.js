const LotAtody = require('../models/lotAtody.model');
const Incubation = require('../models/incubation.model');

const lotAtodyController = {
  async getCapaciteByDate(req, res) {
    try {
      const { date } = req.query;
      if (!date) {
        return res.status(400).json({ error: 'Le paramètre date est requis (?date=YYYY-MM-DD)' });
      }
      const items = await LotAtody.getCapaciteByDate(date);
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getCapaciteByLotAndDate(req, res) {
    try {
      const { date } = req.query;
      const idLot = parseInt(req.params.idLot);
      if (!date) {
        return res.status(400).json({ error: 'Le paramètre date est requis (?date=YYYY-MM-DD)' });
      }
      const item = await LotAtody.getCapaciteByLotAndDate(idLot, date);
      if (!item) {
        return res.status(404).json({ error: 'Lot non trouvé' });
      }
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      await Incubation.processByDate(new Date());
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
      const { idLot, nbAtody, date } = req.body;
      const capacite = await LotAtody.getCapaciteByLotAndDate(parseInt(idLot), date);
      if (!capacite) {
        return res.status(404).json({ error: 'Lot non trouvé' });
      }

      const nbDemande = Number(nbAtody) || 0;
      if (nbDemande <= 0) {
        return res.status(400).json({ error: 'Le nombre d\'oeufs doit être supérieur à 0' });
      }

      if (nbDemande > capacite.oeufsRestants) {
        return res.status(400).json({
          error: `Le nombre d'oeufs dépasse le reste disponible pour ce lot (${capacite.oeufsRestants})`
        });
      }

      const item = await LotAtody.create({ idLot, nbAtody: nbDemande, date });
      await Incubation.processByDate(new Date());
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
