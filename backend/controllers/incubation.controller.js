const Incubation = require('../models/incubation.model');
const LotAtody = require('../models/lotAtody.model');
const Lot = require('../models/lot.model');
const Race = require('../models/race.model');
const { getNbResteOeuf, getNbMaleFemelle } = require('../utils/repartition.utils');

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
      const { idLotAtody } = req.body;

      const lotAtody = await LotAtody.getById(idLotAtody);
      if (!lotAtody) {
        return res.status(404).json({ error: 'LotAtody non trouvé' });
      }

      const lotParent = await Lot.getById(lotAtody.idLot);
      if (!lotParent) {
        return res.status(404).json({ error: 'Lot parent non trouvé' });
      }

      const race = await Race.getById(lotParent.idRace);
      if (!race) {
        return res.status(404).json({ error: 'Race non trouvée' });
      }

      const nbAtodyF = getNbResteOeuf(lotAtody, race);
      if (nbAtodyF <= 0) {
        return res.status(400).json({ error: 'Aucun poussin viable après déduction des oeufs pourris' });
      }

      const eclosionDate = new Date(lotAtody.date);
      eclosionDate.setDate(eclosionDate.getDate() + (race.nbJourIncubation || 30));

      const existing = await Incubation.existsForLotAtodyAndDate(idLotAtody, eclosionDate);
      if (existing) {
        return res.status(409).json({ error: 'Une incubation existe déjà pour ce lot d\'oeufs à cette date' });
      }

      const item = await Incubation.create({ idLotAtody, nbAtodyF, date: eclosionDate });

      await LotAtody.setEclos(idLotAtody);

      const repartition = getNbMaleFemelle(race, nbAtodyF);

      const nouveauLot = await Lot.create({
        idRace: lotParent.idRace,
        nb: nbAtodyF,
        nbMale: repartition.nbMale,
        nbFemelle: repartition.nbFemelle,
        age: 0,
        date: eclosionDate,
        PU: 0
      });
      console.log(`Incubation créée pour lotAtodyId ${idLotAtody} avec ${nbAtodyF} atody fécondés, nouveau lot créé avec id ${nouveauLot.id} a la date ${eclosionDate.toISOString().slice(0, 10)}`);

      res.status(201).json({
        incubation: item,
        nouveauLot: nouveauLot
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async processByDate(req, res) {
    try {
      const { date } = req.query;
      if (!date) {
        return res.status(400).json({ error: 'Le paramètre date est requis (?date=YYYY-MM-DD)' });
      }

      const created = await Incubation.processByDate(date);
      res.json({
        message: 'Incubation automatique traitée',
        date,
        createdCount: created.length,
        created
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
