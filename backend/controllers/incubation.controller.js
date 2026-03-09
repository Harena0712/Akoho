const Incubation = require('../models/incubation.model');
const LotAtody = require('../models/lotAtody.model');
const Lot = require('../models/lot.model');

const incubationController = {
  async getAll(req, res) {
    try {
      const items = await Incubation.getAll();
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const item = await Incubation.getById(parseInt(req.params.id));
      if (!item) return res.status(404).json({ error: 'Incubation non trouvée' });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { idLotAtody, nbAtodyF, date } = req.body;

      // Récupérer le lotAtody source
      const lotAtody = await LotAtody.getById(idLotAtody);
      if (!lotAtody) {
        return res.status(404).json({ error: 'LotAtody non trouvé' });
      }

      // Vérifier qu'il y a assez d'oeufs
      if (nbAtodyF > lotAtody.nbAtody) {
        return res.status(400).json({ error: `Nombre d'oeufs insuffisant (disponible: ${lotAtody.nbAtody})` });
      }

      // Enregistrer l'éclosion
      const item = await Incubation.create({ idLotAtody, nbAtodyF, date });

      // Mettre à jour le lotAtody : réduire le nombre d'oeufs
      await LotAtody.updateNb(idLotAtody, lotAtody.nbAtody - nbAtodyF);

      // Récupérer le lot parent pour connaître la race
      const lotParent = await Lot.getById(lotAtody.idLot);

      // Créer un nouveau lot pour les poussins éclos (age = 0, PU = 0 car issu d'éclosion)
      const nouveauLot = await Lot.create({
        idRace: lotParent.idRace,
        nb: nbAtodyF,
        age: 0,
        date: date,
        PU: 0
      });

      res.status(201).json({
        incubation: item,
        nouveauLot: nouveauLot
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const item = await Incubation.update(parseInt(req.params.id), req.body);
      if (!item) return res.status(404).json({ error: 'Incubation non trouvée' });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await Incubation.delete(parseInt(req.params.id));
      res.json({ message: 'Incubation supprimée' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = incubationController;
