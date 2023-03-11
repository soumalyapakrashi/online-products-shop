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

    static updateProductById(id, title, picture, amount, description) {
        for(let index = 0; index < Product.products.length; index++) {
            if(Product.products[index].id === id) {
                Product.products[index].title = title;
                Product.products[index].picture = picture;
                Product.products[index].amount = amount;
                Product.products[index].description = description;
            }
        }
    }

    static deleteProductById(id) {
        let index_to_delete = Product.products.findIndex(product => product.id === id);

        // If product has been found
        if(index_to_delete !== -1) {
            Product.products.splice(index_to_delete, 1);
        }
    }
}

module.exports = Product;
