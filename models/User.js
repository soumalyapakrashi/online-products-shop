const Sequelize = require('sequelize');
const mongodb = require('mongodb');

const { sequelize, getDb } = require('../utils/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
});

class UserMongo {
    constructor(name, email, cart = undefined, _id = undefined) {
        this.name = name;
        this.email = email;
        this.cart = cart;
        this._id = _id;
    }

    save() {
        const db = getDb();

        // For creating new users
        if(this._id === undefined && this.cart === undefined) {
            this.cart = { items: [] };
            return db.collection('users').insertOne(this);
        }
        // For updating existing users
        else {
            return db.collection('users').updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: {
                    name: this.name,
                    email: this.email,
                    cart: this.cart
                }}
            );
        }
    }

    static findById(id) {
        const db = getDb();
        return db.collection('users').find({ _id: new mongodb.ObjectId(id) }).next();
    }

    getCart() {
        const product_references = this.cart.items;
        const product_ids = product_references.map(reference => {
            return reference._id;
        });
        
        const db = getDb();
        return db.collection('products').find({
            _id: {
                $in: product_ids
            }
        }).toArray().then(products => {
            return products.map(product => {
                const found_item = this.cart.items.find(item => {
                    return item._id.toString() === product._id.toString();
                });
                
                return {
                    ...product,
                    quantity: found_item.quantity
                };
            })
        }).catch(error => {
            console.log(error);
        });
    }
}

module.exports = {
    User: User,
    UserMongo: UserMongo
};
