const db = require('../utils/database');

class Product {
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
