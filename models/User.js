const mongodb = require('mongodb');
const mongoose = require('mongoose');

const { getDb } = require('../utils/database');

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
            // console.log(item);
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

module.exports = mongoose.model('User', UserSchema);

// class User {
//     constructor(name, email, cart = undefined, _id = undefined) {
//         this.name = name;
//         this.email = email;
//         this.cart = cart;
//         this._id = _id;
//     }

//     save() {
//         const db = getDb();

//         // For creating new users
//         if(this._id === undefined && this.cart === undefined) {
//             this.cart = { items: [] };
//             return db.collection('users').insertOne(this);
//         }
//         // For updating existing users
//         else {
//             return db.collection('users').updateOne(
//                 { _id: new mongodb.ObjectId(this._id) },
//                 { $set: {
//                     name: this.name,
//                     email: this.email,
//                     cart: this.cart
//                 }}
//             );
//         }
//     }

//     static findById(id) {
//         const db = getDb();
//         return db.collection('users').find({ _id: new mongodb.ObjectId(id) }).next();
//     }

//     getCart() {
//         const product_references = this.cart.items;
//         const product_ids = product_references.map(reference => {
//             return reference._id;
//         });
        
//         const db = getDb();
//         return db.collection('products').find({
//             _id: {
//                 $in: product_ids
//             }
//         }).toArray().then(products => {
//             return products.map(product => {
//                 const found_item = this.cart.items.find(item => {
//                     return item._id.toString() === product._id.toString();
//                 });
                
//                 return {
//                     ...product,
//                     quantity: found_item.quantity
//                 };
//             })
//         }).catch(error => {
//             console.log(error);
//         });
//     }

//     deleteProductFromCart(product_id) {
//         const remaining_products = this.cart.items.filter(item => {
//             return item._id.toString() !== product_id;
//         })

//         this.cart.items = remaining_products;

//         const db = getDb();
//         return db.collection('users').updateOne(
//             { _id: new mongodb.ObjectId(this._id) },
//             { $set: {
//                 cart: this.cart
//             }}
//         );
//     }

//     getQuantity(product_id) {
//         const found_product = this.cart.items.find(item => {
//             return item._id.toString() === product_id;
//         });

//         return found_product?.quantity ? found_product.quantity : 0;
//     }

//     createOrder() {
//         const db = getDb();

//         // Get the products from the cart
//         return this.getCart().then(products => {
//             // Create an order object. This order object should contain the products currently
//             // in cart along with the current user's userid.
//             const order = {
//                 userid: new mongodb.ObjectId(this._id),
//                 createdAt: new Date().toLocaleString(),
//                 products: products
//             };

//             // Add the order to the orders collection
//             return db.collection('orders').insertOne(order);
//         }).then(() => {
//             // On successfully entering the order in database, clear the local and
//             // database copies of the cart
//             this.cart = { items: [] };

//             return db.collection('users').updateOne(
//                 { _id: new mongodb.ObjectId(this._id) },
//                 { $set: {
//                     cart: this.cart
//                 }}
//             );
//         }).catch(error => {
//             console.log(error);
//         });
//     }

//     getOrders() {
//         const db = getDb();

//         return db.collection('orders').find({ userid: new mongodb.ObjectId(this._id) }).toArray();
//     }
// }

// module.exports = {
//     User: User
// };
