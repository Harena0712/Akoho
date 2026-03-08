const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/situation.controller');

// GET /api/situation?date=2026-03-07
router.get('/', ctrl.getByDate);

module.exports = router;
