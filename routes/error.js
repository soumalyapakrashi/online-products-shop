const express = require('express');

const errorController = require('../controllers/error');

const router = express.Router();

router.use(errorController);

module.exports = router;
