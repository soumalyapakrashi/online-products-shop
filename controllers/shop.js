const { Product, ProductMongo } = require( "../models/Product");

function listProductsPage(request, response, next) {
    // Product.findAll().then(products => {
    //     response.render('shop/list-product', { 
    //         pageTitle: 'Products',
    //         activePage: 'Products',
    //         products: products
    //     });
    // }).catch(error => {
    //     console.log(error);
    // });

    ProductMongo.fetchAll().then(products => {
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
    // // First get the product whose detail needs to be displayed
    // Product.findByPk(request.params.productId).then(product => {
    //     // Fetch the cart of the current user. This is used to display the number of
    //     // current items in cart.
    //     request.user.getCart().then(cart => {
    //         // Fetch the current product (to be displayed) from the current user's cart
    //         return cart.getProducts( { where: { id: product.id } } );
    //     }).then(cart_products => {
    //         // The product can either be present or not.
    //         // If the product is present, get the quantity of the product through the
    //         // 'cartitem' property that every product fetched through Cart will have.
    //         // Else, set the quantity to 0.
    //         let quantity;

    //         if(cart_products.length !== 0) {
    //             quantity = cart_products[0].cartitem.quantity;
    //         }
    //         else {
    //             quantity = 0;
    //         }

    //         response.render('shop/product-detail', { 
    //             pageTitle: product.title, 
    //             activePage: 'Products', 
    //             product: product,
    //             quantity: quantity
    //         });
    //     }).catch(error => {
    //         console.log(error);
    //     })
    // }).catch(error => {
    //     console.log(error);
    // })

    // First get the product whose detail needs to be displayed
    ProductMongo.findById(request.params.productId).then(product => {
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
        // MySQL implementation
        // let user_cart;
        // let product_to_add;
        
        // // Get the product to be added
        // Product.findByPk(product_id).then(product => {
        //     product_to_add = product;

        //     // Get the cart of the current user (to which the product is to be added).
        //     return request.user.getCart();
        // }).then(cart => {
        //     user_cart = cart;

        //     // Check if product exists in cart.
        //     return cart.getProducts({
        //         where: {
        //             id: product_id
        //         }
        //     })
        // }).then(products => {
        //     // If product not in cart, add it and set quantity to 1.
        //     if(products.length === 0) {
        //         user_cart.addProduct(product_to_add, { through: { quantity: 1 } }).then(() => {
        //             // Once product is added, redirect to page
        //             if(current_page === 'productDetail') {
        //                 response.redirect(`/products/${product_id}`);
        //             }
        //             else {
        //                 response.redirect('/products');
        //             }
        //         }).catch(error => {
        //             console.log(error);
        //         })
        //     }
        //     // If product exists in cart, then update the quantity by increasing it by 1.
        //     // Adding the same product to cart with a new quantity value will automatically
        //     // update the previous value and will not create a new entry in the table.
        //     else {
        //         const new_quantity = products[0].cartitem.quantity + 1;
        //         user_cart.addProduct(products[0], { through: { quantity: new_quantity }}).then(() => {
        //             // Once quantity is updated, redirect to page
        //             if(current_page === 'productDetail') {
        //                 response.redirect(`/products/${product_id}`);
        //             }
        //             else {
        //                 response.redirect('/products');
        //             }
        //         }).catch(error => {
        //             console.log(error);
        //         })
        //     }
        // }).catch(error => {
        //     console.log(error);
        // })

        
        // MongoDB implementation
        // Get the products already in cart
        let { items: cart_products } = request.user.cart;

        // Get the product to be added
        ProductMongo.findById(product_id).then(product => {
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
    // MySQL Implementation
    // request.user.getCart().then(cart => {
    //     return cart.getProducts();
    // }).then(products => {
    //     // Calculate total amount, taxes, and gross amount
    //     let total_amount = 0;
    //     for(let product of products) {
    //         total_amount += product.amount * product.cartitem.quantity;
    //     }
    //     // If some product is present, then add the tax. Else not.
    //     const tax = total_amount > 0 ? 10 : 0;
    //     const gross_amount = total_amount + tax;

    //     response.render('shop/cart', { 
    //         pageTitle: 'Cart',
    //         activePage: 'Cart',
    //         cart: products,
    //         totalAmount: total_amount,
    //         tax: tax,
    //         grossAmount: gross_amount
    //     });
    // }).catch(error => {
    //     console.log(error);
    // })

    // MongoDB Implementation
    request.user.getCart().then(products => {
        // console.log("Products", products);
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
    // First get the current user's cart
    let user_cart;
    request.user.getCart().then(cart => {
        user_cart = cart;
        // Then get all the products in the cart
        return cart.getProducts();
    }).then(products => {
        // Create a new order for the current user
        return request.user.createOrder().then(order => {
            // Add the products currently in cart to the newly created order.
            // But as each product has different quantities to be added, we add a new field
            // to the product object with which sequelize will update the joining table properly.
            return order.addProducts(products.map(product => {
                // This will help to update the joining table properly.
                // Sequelize will look for 'orderitem' property as this is the name of the
                // joining table. We set the 'quantity' property in this table.
                product.orderitem = {
                    quantity: product.cartitem.quantity
                }
                return product;
            }));
        }).catch(errors => {
            console.log(errors);
        })
    }).then(() => {
        // Then clear the cart as items has already been added to the order
        return user_cart.setProducts(null);
    }).then(() => {
        response.redirect('/orders');
    }).catch(errors => {
        console.log(errors);
    })
}

function showOrdersPage(request, response, next) {
    // Get all the orders for the current user. We are 'Eager Loading' the Products as well
    // with the orders. Each order object will also have the products contained within that order.
    request.user.getOrders({ include: Product }).then(orders => {
        for(let order of orders) {
            // Calculate the total amount of all the products in the order
            let total_amount = 0;
            for(let product of order.products) {
                total_amount += product.amount * product.orderitem.quantity;
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
