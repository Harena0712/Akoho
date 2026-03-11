const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/confSakafo.controller');

router.get('/', ctrl.getAll);
router.get('/poids-akoho', ctrl.getPoidsAkoho);
router.get('/:id', ctrl.getById);
router.get('/race/:idRace', ctrl.getByRace);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;
