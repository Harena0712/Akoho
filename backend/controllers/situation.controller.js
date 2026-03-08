const Situation = require('../models/situation.model');

const situationController = {
  async getByDate(req, res) {
    try {
      const { date } = req.query;
      if (!date) {
        return res.status(400).json({ error: 'Le paramètre date est requis (?date=YYYY-MM-DD)' });
      }
      const situation = await Situation.getByDate(date);
      res.json(situation);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = situationController;
