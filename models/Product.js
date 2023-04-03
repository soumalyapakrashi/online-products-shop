const Sequelize = require('sequelize');
const mongodb = require('mongodb');

const { sequelize, getDb } = require('../utils/database');

class ProductMongo {
    constructor(title, picture, amount, description, id = undefined) {
        this.title = title,
        this.picture = picture;
        this.amount = amount;
        this.description = description;
        this._id = id === undefined ? id : new mongodb.ObjectId(id);
    }

    save() {
        const db = getDb();

        if(this._id === undefined) {
            return db.collection('products').insertOne(this);
        }
        else {
            return db.collection('products').updateOne(
                { _id: this._id },
                { $set: this }
            )
        }
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray().then(products => {
            return products;
        }).catch(error => {
            console.log(error);
        })
    }

    static findById(id) {
        const db = getDb();
        return db.collection('products').find({
            _id: new mongodb.ObjectId(id)
        }).next().then(product => {
            return product;
        }).catch(error => {
            console.log(error);
        })
    }

    static deleteById(id) {
        const db = getDb();
        return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(id)});
    }
}

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    picture: {
        type: Sequelize.STRING,
        allowNull: false
    },
    amount: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT('long'),
        allowNull: false
    }
});

module.exports = {
    Product: Product,
    ProductMongo: ProductMongo
};
