const Product = require( "../models/Product");

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
    // First get the product whose detail needs to be displayed
    Product.findByPk(request.params.productId).then(product => {
        // Fetch the cart of the current user. This is used to display the number of
        // current items in cart.
        request.user.getCart().then(cart => {
            // Fetch the current product (to be displayed) from the current user's cart
            return cart.getProducts( { where: { id: product.id } } );
        }).then(cart_products => {
            // The product can either be present or not.
            // If the product is present, get the quantity of the product through the
            // 'cartitem' property that every product fetched through Cart will have.
            // Else, set the quantity to 0.
            let quantity;

            if(cart_products.length !== 0) {
                quantity = cart_products[0].cartitem.quantity;
            }
            else {
                quantity = 0;
            }

            response.render('shop/product-detail', { 
                pageTitle: product.title, 
                activePage: 'Products', 
                product: product,
                quantity: quantity
            });
        }).catch(error => {
            console.log(error);
        })
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
        let user_cart;
        let product_to_add;
        
        // Get the product to be added
        Product.findByPk(product_id).then(product => {
            product_to_add = product;

            // Get the cart of the current user (to which the product is to be added).
            return request.user.getCart();
        }).then(cart => {
            user_cart = cart;

            // Check if product exists in cart.
            return cart.getProducts({
                where: {
                    id: product_id
                }
            })
        }).then(products => {
            // If product not in cart, add it and set quantity to 1.
            if(products.length === 0) {
                user_cart.addProduct(product_to_add, { through: { quantity: 1 } }).then(() => {
                    // Once product is added, redirect to page
                    if(current_page === 'productDetail') {
                        response.redirect(`/products/${product_id}`);
                    }
                    else {
                        response.redirect('/products');
                    }
                }).catch(error => {
                    console.log(error);
                })
            }
            // If product exists in cart, then update the quantity by increasing it by 1.
            // Adding the same product to cart with a new quantity value will automatically
            // update the previous value and will not create a new entry in the table.
            else {
                const new_quantity = products[0].cartitem.quantity + 1;
                user_cart.addProduct(products[0], { through: { quantity: new_quantity }}).then(() => {
                    // Once quantity is updated, redirect to page
                    if(current_page === 'productDetail') {
                        response.redirect(`/products/${product_id}`);
                    }
                    else {
                        response.redirect('/products');
                    }
                }).catch(error => {
                    console.log(error);
                })
            }
        }).catch(error => {
            console.log(error);
        })
    }

    // If deleting from cart, delete a single instance of the product
    else if(action === "delete") {
        // First, get the cart from which the product is to be deleted
        request.user.getCart().then(cart => {
            // Then get the desired product whose single instance is to be deleted
            cart.getProducts({ where: { id: product_id } }).then(products => {
                // Set the new quantity
                const new_quantity = products[0].cartitem.quantity - 1;
                // If more than 1 instance of the product is left in cart after updation, then just
                // update the product in the cart.
                if(new_quantity > 0) {
                    return cart.addProduct(products[0], { through: { quantity: new_quantity } });
                }
                // Else if no instance is left, delete the product from the cart.
                // NOTE: Do not call destroy() on the product as it will delete the whole product
                // itself from the products table. Call the destroy() method on the cartitem
                // property of the product which will just delete the entry in the cartitems table
                // and essentially it will signify that the product is deleted from the
                // respective user's cart.
                else {
                    return products[0].cartitem.destroy();
                }
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
            })
        }).catch(error => {
            console.log(error);
        })
    }
}

function deleteFromCart(request, response, next) {
    const product_id = request.params.productId;
    // First get the current user's cart from which product is to be deleted
    request.user.getCart().then(cart => {
        // Then get the product which is to be deleted
        return cart.getProducts({ where: { id: product_id } });
    }).then(products => {
        // As we have passed an id, we know that only 1 instance of the product will
        // be returned. So, delete the first product from the list. This will delete the
        // product from the cartitems table.
        return products[0].cartitem.destroy();
    }).then(() => {
        response.redirect('/cart');
    }).catch(errors => {
        console.log(errors);
    })
}

function showCartPage(request, response, next) {
    request.user.getCart().then(cart => {
        return cart.getProducts();
    }).then(products => {
        // Calculate total amount, taxes, and gross amount
        let total_amount = 0;
        for(let product of products) {
            total_amount += product.amount * product.cartitem.quantity;
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
    }).catch(error => {
        console.log(error);
    })
}

function showCheckoutPage(request, response, next) {
    request.user.getCart().then(cart => {
        return cart.getProducts();
    }).then(products => {
        // Calculate total amount, taxes, and gross amount
        let total_amount = 0;
        for(let product of products) {
            total_amount += product.amount * product.cartitem.quantity;
        }
        // If some product is present, then add the tax. Else not.
        const tax = total_amount > 0 ? 10 : 0;
        const gross_amount = total_amount + tax;

        response.render('shop/checkout', {
            pageTitle: 'Checkout',
            activePage: 'Cart',
            cart: products,
            totalAmount: total_amount,
            tax: tax,
            grossAmount: gross_amount
        });
    })
}

function placeOrder(request, response, next) {
    request.user.getCart().then(cart => {
        return cart.getProducts();
    }).then(products => {
        request.user.createOrder().then(order => {
            return order.addProducts(products.map(product => {
                product.orderitem = {
                    quantity: product.cartitem.quantity
                }
                return product;
            }));
        }).then(() => {
            response.redirect('/orders');
        }).catch(errors => {
            console.log(errors);
        })
    }).catch(errors => {
        console.log(errors);
    })
}

module.exports = {
    listProductsPage: listProductsPage,
    showProductPage: showProductPage,
    postToCart: postToCart,
    showCartPage: showCartPage,
    deleteFromCart: deleteFromCart,
    showCheckoutPage: showCheckoutPage,
    placeOrder: placeOrder
}
