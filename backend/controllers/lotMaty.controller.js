const LotMaty = require('../models/lotMaty.model');
const Lot = require('../models/lot.model');
const Race = require('../models/race.model');
const { getNbMaleFemelle } = require('../utils/repartition.utils');

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
      const { idLot, nbMaty, date } = req.body;

      const lot = await Lot.getById(parseInt(idLot));
      if (!lot) {
        return res.status(404).json({ error: 'Lot non trouvé' });
      }

      const race = await Race.getById(lot.idRace);
      if (!race) {
        return res.status(404).json({ error: 'Race non trouvée' });
      }

      const repartition = getNbMaleFemelle(race, nbMaty, 'mortMale', 'mortFemelle');

      const item = await LotMaty.create({
        idLot,
        nbMaty,
        nbMale: repartition.nbMale,
        nbFemelle: repartition.nbFemelle,
        date
      });
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { idLot, nbMaty, date } = req.body;

      const lot = await Lot.getById(parseInt(idLot));
      if (!lot) {
        return res.status(404).json({ error: 'Lot non trouvé' });
      }

      const race = await Race.getById(lot.idRace);
      if (!race) {
        return res.status(404).json({ error: 'Race non trouvée' });
      }

      const repartition = getNbMaleFemelle(race, nbMaty, 'mortMale', 'mortFemelle');

      const item = await LotMaty.update(parseInt(req.params.id), {
        idLot,
        nbMaty,
        nbMale: repartition.nbMale,
        nbFemelle: repartition.nbFemelle,
        date
      });
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
