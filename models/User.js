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
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    static findById(id) {
        const db = getDb();
        return db.collection('users').find({ _id: new mongodb.ObjectId(id) }).next();
    }
}

module.exports = {
    User: User,
    UserMongo: UserMongo
};
