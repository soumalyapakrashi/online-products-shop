const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/add-product', adminController.addProductPage);

router.post('/post-product', adminController.postProduct);

router.get('/edit-product/:productId', adminController.editProductPage);

router.post('/edit-product/:productId', adminController.editProduct);

router.get('/products', adminController.listProductPage);

module.exports = router;
