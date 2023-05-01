const express = require('express');

const authController = require('../controllers/authentication');
const isLoggedIn = require('../middleware/isLoggedIn');

const router = express.Router();

router.get('/login', authController.getLoginPage);

router.post('/login', authController.postLogin);

router.post('/logout', isLoggedIn, authController.postLogout);

router.get('/signup', authController.getSignupPage);

router.post('/signup', authController.postSignup);

module.exports = router;
