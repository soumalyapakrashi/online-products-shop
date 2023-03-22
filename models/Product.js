const fs = require('fs');
const path = require('path');

const db = require('../utils/database');

class Product {
    static products = [];

    constructor(title, picture, amount, description) {
        Product.#readFile();
        
        Product.products.push({
            id: Math.random().toString(),
            title: title,
            picture: picture,
            amount: amount,
            description: description
        });

        Product.#writeFile();
    }

    static #readFile() {
        const file = fs.readFileSync(path.resolve(__dirname, '../data/products.json'), 'utf-8');
        if(file !== '') {
            Product.products = JSON.parse(file);
        }
    }

    static #writeFile() {
        fs.writeFileSync(path.resolve(__dirname, '../data/products.json'), JSON.stringify(Product.products));
    }

    static addProduct(title, picture, amount, description) {
        return db.execute(
            'INSERT INTO product (title, picture, amount, description) VALUES (?, ?, ?, ?)',
            [ title, picture, amount, description ]
        );
    }

    static getProducts() {
        return db.execute('SELECT * FROM product');
    }

    static getProductById(id) {
        return db.execute(
            'SELECT * FROM product WHERE id = ?',
            [ id ]
        );
    }

    static updateProductById(id, title, picture, amount, description) {
        return db.execute(
            'UPDATE product SET title = ?, picture = ?, amount = ?, description = ? WHERE id = ?',
            [ title, picture, amount, description, id ]
        );
    }

    static deleteProductById(id) {
        return db.execute(
            'DELETE FROM product WHERE id = ?',
            [ id ]
        );
    }
}

module.exports = Product;
