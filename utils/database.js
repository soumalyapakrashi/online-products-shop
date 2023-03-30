const path = require('path');

const Sequelize = require('sequelize');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
require('dotenv').config({
    path: path.resolve(__dirname, '..', '.env')
});

// Connect to MySQL through sequelize
const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        dialect: 'mysql',
        host: process.env.MYSQL_HOST
    }
);

// Connect to MongoDB Atlas through mongodb
let _db;

function mongoConnect() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.rys2m9o.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`)
        .then(client => {
            _db = client.db();
            resolve(client);
        }).catch(error => {
            reject(error);
        })
    });
}

// Return the database connection
function getDb() {
    if(_db) {
        return _db;
    }
    else {
        throw 'MongoDB not connected';
    }
}

module.exports = {
    sequelize: sequelize,
    mongoConnect: mongoConnect,
    getDb: getDb
};
