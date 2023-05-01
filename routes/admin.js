const express = require('express');
const admin = require('../controllers/admin');

const adminController = require('../controllers/admin');
const isLoggedIn = require('../middleware/isLoggedIn');

const router = express.Router();

router.get('/add-product', isLoggedIn, adminController.addProductPage);

router.post('/post-product', isLoggedIn, adminController.postProduct);

router.get('/edit-product/:productId', isLoggedIn, adminController.editProductPage);

router.post('/edit-product/:productId', isLoggedIn, adminController.editProduct);

router.post('/delete-product/:productId', isLoggedIn, adminController.deleteProduct);

router.get('/products', isLoggedIn, adminController.listProductPage);

module.exports = router;
