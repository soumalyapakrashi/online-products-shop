const path = require('path');

const Sequelize = require('sequelize');
require('dotenv').config({
    path: path.resolve(__dirname, '..', '.env')
});

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        dialect: 'mysql',
        host: process.env.MYSQL_HOST
    }
);

module.exports = sequelize;
