const Sequelize = require('sequelize');

const { sequelize, getDb } = require('../utils/database');

class ProductMongo {
    constructor(title, picture, amount, description) {
        this.title = title,
        this.picture = picture;
        this.amount = amount;
        this.description = description;
    }

    save() {
        const db = getDb();
        return db.collection('products').insertOne(this);
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
