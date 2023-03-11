class Product {
    static products = [];

    constructor(title, picture, amount, description) {
        Product.products.push({
            id: Math.random().toString(),
            title: title,
            picture: picture,
            amount: amount,
            description: description
        });
    }

    static getProducts() {
        return Product.products;
    }

    static getProductById(id) {
        return Product.products.find(product => product.id === id);
    }
}

module.exports = Product;
