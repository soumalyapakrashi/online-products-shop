const fs = require('fs');
const path = require('path');

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

    static getProducts() {
        Product.#readFile();
        return Product.products;
    }

    static getProductById(id) {
        Product.#readFile();
        return Product.products.find(product => product.id === id);
    }

    static updateProductById(id, title, picture, amount, description) {
        for(let index = 0; index < Product.products.length; index++) {
            if(Product.products[index].id === id) {
                Product.products[index].title = title;
                Product.products[index].picture = picture;
                Product.products[index].amount = amount;
                Product.products[index].description = description;
            }
        }
        Product.#writeFile();
    }

    static deleteProductById(id) {
        let index_to_delete = Product.products.findIndex(product => product.id === id);

        // If product has been found
        if(index_to_delete !== -1) {
            Product.products.splice(index_to_delete, 1);
        }

        Product.#writeFile();
    }
}

module.exports = Product;
