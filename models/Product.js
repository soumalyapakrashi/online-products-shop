const mongodb = require('mongodb');

const { getDb } = require('../utils/database');

class Product {
    constructor(title, picture, amount, description, userid, id = undefined) {
        this.title = title,
        this.picture = picture;
        this.amount = amount;
        this.description = description;
        this.userid = new mongodb.ObjectId(userid);
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

module.exports = {
    Product: Product
};
