const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/lotAtody.controller');

router.get('/', ctrl.getAll);
router.get('/capacite', ctrl.getCapaciteByDate);
router.get('/capacite/lot/:idLot', ctrl.getCapaciteByLotAndDate);
router.get('/lot/:idLot', ctrl.getByLot);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;
