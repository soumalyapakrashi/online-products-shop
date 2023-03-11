const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/products', shopController.listProductsPage);

router.get('/products/:productId', shopController.showProductPage);

router.get('/cart', (request, response, next) => {
    response.render('shop/cart', { pageTitle: 'Cart', activePage: 'Cart' })
})

router.get('/', (request, response, next) => {
    response.render('shop/index', { pageTitle: 'Shop', activePage: 'Shop' })
});

module.exports = router;
