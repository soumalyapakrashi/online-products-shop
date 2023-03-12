class Cart {
    static #cart = [];

    static addToCart(product, quantity) {
        const item_index = Cart.#cart.findIndex(item => item.product.id === product.id);
        // If item is not already in the cart, then add it
        if(item_index === -1) {
            Cart.#cart.push({
                product: product,
                quantity: quantity
            });
        }
        // Else, if it is in the cart, then increase the quantity
        else {
            Cart.#cart[item_index].quantity += quantity;
        }
    }

    static findProductById(id) {
        const item_index = Cart.#cart.find(item => item.product.id === id);
        if(item_index === undefined) {
            return undefined;
        }
        else {
            return Cart.#cart[item_index];
        }
    }

    static getProducts() {
        return Cart.#cart;
    }
}

module.exports = Cart;
