const express = require('express');

const authController = require('../controllers/authentication');

const router = express.Router();

router.get('/login', authController.getLoginPage);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

module.exports = router;
