const Product = require( "../models/Product");

function listProductsPage(request, response, next) {
    Product.find().then(products => {
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
    // First get the product whose detail needs to be displayed
    Product.findById(request.params.productId).then(product => {
        // const quantity = request.user.getQuantity(request.params.productId);

        response.render('shop/product-detail', { 
            pageTitle: product.title, 
            activePage: 'Products', 
            product: product,
            quantity: 0
        });
    }).catch(error => {
        console.log(error);
    })
}

function postToCart(request, response, next) {
    const product_id = request.params.productId;
    const current_page = request.query.currentPage;
    const action = request.body.action;

    // If adding to cart, add a single instance of the product to cart
    if(action === 'add') {
        // Get the products already in cart
        let { items: cart_products } = request.user.cart;

        // Get the product to be added
        Product.findById(product_id).then(product => {
            const product_index = cart_products.findIndex(cart_product => {
                return cart_product._id.toString() == product._id.toString();
            });

            // If product is not found in cart, then add it and set quantity to 1
            if(product_index === -1) {
                cart_products.push({
                    _id: product._id,
                    quantity: 1
                });
            }
            // Else if product is found in cart, then increase the quantity
            else {
                cart_products[product_index].quantity += 1;
            }

            // Save the updated cart
            request.user.save().then(() => {
                // Once product is added, redirect to page
                if(current_page === 'productDetail') {
                    response.redirect(`/products/${product_id}`);
                }
                else {
                    response.redirect('/products');
                }
            }).catch(error => {
                console.log(error);
            });
        }).catch(error => {
            console.log(error);
        })
    }

    // If deleting from cart, delete a single instance of the product
    else if(action === "delete") {
        const index = request.user.cart.items.findIndex(item => {
            return item._id.toString() === product_id;
        });
        request.user.cart.items[index].quantity -= 1;

        if(request.user.cart.items[index].quantity === 0) {
            request.user.deleteProductFromCart(product_id).then(() => {
                return request.user.save();
            }).then(() => {
                // After updation, redirect to appropriate page
                if(current_page === 'productDetail') {
                    response.redirect(`/products/${product_id}`);
                }
                else {
                    response.redirect('/products');
                }
            }).catch(error => {
                console.log(error);
            });
        }
        else {
            request.user.save().then(() => {
                // After updation, redirect to appropriate page
                if(current_page === 'productDetail') {
                    response.redirect(`/products/${product_id}`);
                }
                else {
                    response.redirect('/products');
                }
            });
        }
    }
}

function deleteFromCart(request, response, next) {
    const product_id = request.params.productId;
    
    request.user.deleteProductFromCart(product_id).then(() => {
        response.redirect('/cart');
    }).catch(error => {
        console.log(error);
    })
}

function showCartPage(request, response, next) {
    request.user.getCart().then(products => {
        // Calculate total amount, taxes, and gross amount
        let total_amount = 0;
        for(let product of products) {
            total_amount += product.amount * product.quantity;
        }
        // If some product is present, then add the tax. Else not.
        const tax = total_amount > 0 ? 10 : 0;
        const gross_amount = total_amount + tax;

        response.render('shop/cart', { 
            pageTitle: 'Cart',
            activePage: 'Cart',
            cart: products,
            totalAmount: total_amount,
            tax: tax,
            grossAmount: gross_amount
        });
    });
}

function showCheckoutPage(request, response, next) {
    request.user.getCart().then(products => {
        // Calculate total amount, taxes, and gross amount
        let total_amount = 0;
        for(let product of products) {
            total_amount += product.amount * product.quantity;
        }
        // If some product is present, then add the tax. Else not.
        const tax = total_amount > 0 ? 10 : 0;
        const gross_amount = total_amount + tax;

        response.render('shop/checkout', { 
            pageTitle: 'Cart',
            activePage: 'Cart',
            cart: products,
            totalAmount: total_amount,
            tax: tax,
            grossAmount: gross_amount
        });
    });
}

function placeOrder(request, response, next) {
    request.user.createOrder().then(() => {
        response.redirect('/orders');
    }).catch(error => {
        console.log(error);
    })
}

function showOrdersPage(request, response, next) {
    request.user.getOrders().then(orders => {
        for(let order of orders) {
            // Calculate the total amount of all the products in the order
            let total_amount = 0;
            for(let product of order.products) {
                total_amount += product.amount * product.quantity;
            }
            order.totalAmount = total_amount;
            // Set the picture of the order to be the first product which we get.
            // This is arbitrary and not for any reason!
            order.picture = order.products[0].picture;
        }
        response.render('shop/order', {
            pageTitle: 'Orders',
            activePage: 'Orders',
            orders: orders
        })
    }).catch(error => {
        console.log(error);
    })
}

module.exports = {
    listProductsPage: listProductsPage,
    showProductPage: showProductPage,
    postToCart: postToCart,
    showCartPage: showCartPage,
    deleteFromCart: deleteFromCart,
    showCheckoutPage: showCheckoutPage,
    placeOrder: placeOrder,
    showOrdersPage: showOrdersPage
}
