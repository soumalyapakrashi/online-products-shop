const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

// This model represents each product stored in the cart.
// In SQL terms, it acts as the joining table between Cart and Product as they have a
// many-to-many relationship.
const CartItem = sequelize.define('cartitem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = CartItem;
