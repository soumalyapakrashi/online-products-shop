const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/products', shopController.listProductsPage);

router.get('/products/:productId', shopController.showProductPage);

router.get('/cart', shopController.showCartPage);

router.post('/post-cart/:productId', shopController.postToCart);

router.post('/delete-cart/:productId', shopController.deleteFromCart);

router.get('/checkout', shopController.showCheckoutPage);

router.post('/place-order', shopController.placeOrder);

router.get('/orders', shopController.showOrdersPage);

router.get('/', (request, response, next) => {
    response.render('shop/index', { 
        pageTitle: 'Shop',
        activePage: 'Shop',
        isAuthenticated: request.user ? true : false,
        loggedInUsername: request.user ? request.user.name : undefined,
        isAdminUser: true
    })
});

module.exports = router;
