const Product = require( "../models/Product");
const Cart = require("../models/Cart");

function listProductsPage(request, response, next) {
    Product.findAll().then(products => {
        response.render('shop/list-product', { 
            pageTitle: 'Products',
            activePage: 'Products',
            products: products
        });
    }).catch(error => {
        console.log(error);
    });
}

function showProductPage(request, response, next) {
    Product.findByPk(request.params.productId).then(product => {
        const product_in_cart = Cart.findProductById(request.params.productId);
    
        const quantity = product_in_cart !== undefined ? product_in_cart.quantity : 0;
    
        response.render('shop/product-detail', { 
            pageTitle: product.title, 
            activePage: 'Products', 
            product: product,
            quantity: quantity
        });
    }).catch(error => {
        console.log(error);
    })
}

function postToCart(request, response, next) {
    const product_id = request.params.productId;
    const current_page = request.query.currentPage;
    const action = request.body.action;

    if(action === 'add') {
        // Check if product actually exists in the catalog
        const product = Product.getProductById(product_id);

        // If product exists in catalog, add it to cart
        if(product !== undefined) {
            Cart.addToCart(product, 1);
        }
    }
    else if(action === "delete") {
        Cart.removeFromCart(product_id, 1);
    }

    if(current_page === 'productDetail') {
        response.redirect(`/products/${product_id}`);
    }
    else {
        response.redirect('/products');
    }
}

function deleteFromCart(request, response, next) {
    const product_id = request.params.productId;
    Cart.removeFromCart(product_id, -1);
    response.redirect('/cart');
}

function showCartPage(request, response, next) {
    const cart = Cart.getProducts();

    // Calculate total amount, taxes, and gross amount
    let total_amount = 0;
    for(let cart_item of cart) {
        total_amount += cart_item.product.amount * cart_item.quantity;
    }
    const tax = 10;
    const gross_amount = total_amount + tax;

    response.render('shop/cart', { 
        pageTitle: 'Cart',
        activePage: 'Cart',
        cart: cart,
        totalAmount: total_amount,
        tax: tax,
        grossAmount: gross_amount
    });
}

module.exports = {
    listProductsPage: listProductsPage,
    showProductPage: showProductPage,
    postToCart: postToCart,
    showCartPage: showCartPage,
    deleteFromCart: deleteFromCart
}
