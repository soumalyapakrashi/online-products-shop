const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

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

module.exports = Product;
