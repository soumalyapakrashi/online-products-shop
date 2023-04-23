const mongoose = require('mongoose');

const Order = require('./Order');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});

// Function to add / update user cart
UserSchema.methods.addToCart = function(product) {
    const product_index = this.cart.items.findIndex(cart_product => {
        return cart_product.productId.toString() == product._id.toString();
    });

    // If product is not found in cart, then add it and set quantity to 1
    if(product_index === -1) {
        this.cart.items.push({
            productId: product._id,
            quantity: 1
        });
    }
    // Else if product is found in cart, then increase the quantity
    else {
        this.cart.items[product_index].quantity += 1;
    }

    return this.save();
}

// Function to delete product from user cart
UserSchema.methods.deleteProductFromCart = function(productId) {
    const remaining_products = this.cart.items.filter(item => {
        return item.productId.toString() !== productId;
    })

    this.cart.items = remaining_products;

    return this.save();
}

// Function to return user cart populated with products
UserSchema.methods.getCart = function() {
    return this.populate('cart.items.productId').then(user_object => {
        // Extract the populated products from user object
        const products = user_object.cart.items.map(item => {
            return {
                ...item.productId._doc,
                quantity: item.quantity
            };
        })

        return products;
    }).catch(error => {
        throw error;
    })
}

// Function to create a new order for the current user
UserSchema.methods.createOrder = function() {
    // Get the products from the cart
    return this.getCart().then(products => {
        // Create an order object. This order object should contain the products currently
        // in cart along with the current user's userid.
        const order = new Order({
            userId: this,
            createdAt: new Date().toLocaleString(),
            products: products
        });

        // Add the order to the orders collection
        return order.save();
    }).then(() => {
        // On successfully entering the order in database, clear the local and
        // database copies of the cart
        this.cart = { items: [] };

        return this.save();
    }).catch(error => {
        console.log(error);
    });
}

// Function to get all orders of the current user
UserSchema.methods.getOrders = function() {
    return Order.find({ "userId": this })
}

module.exports = mongoose.model('User', UserSchema);
