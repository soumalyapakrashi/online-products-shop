const express = require('express');

const shopController = require('../controllers/shop');
const isLoggedIn = require('../middleware/isLoggedIn');

const router = express.Router();

router.get('/products', shopController.listProductsPage);

router.get('/products/:productId', shopController.showProductPage);

router.get('/cart', isLoggedIn, shopController.showCartPage);

router.post('/post-cart/:productId', isLoggedIn, shopController.postToCart);

router.post('/delete-cart/:productId', isLoggedIn, shopController.deleteFromCart);

router.get('/checkout', isLoggedIn, shopController.showCheckoutPage);

router.post('/place-order', isLoggedIn, shopController.placeOrder);

router.get('/orders', isLoggedIn, shopController.showOrdersPage);

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
