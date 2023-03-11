const Product = require( "../models/Product");

function listProductsPage(request, response, next) {
    response.render('shop/list-product', { 
        pageTitle: 'Products', 
        activePage: 'Products', 
        products: Product.getProducts() 
    });
}

function showProductPage(request, response, next) {
    const product = Product.getProductById(request.params.productId);
    response.render('shop/product-detail', { 
        pageTitle: product.title, 
        activePage: 'Products', 
        product: product
    });
}

module.exports = {
    listProductsPage: listProductsPage,
    showProductPage: showProductPage
}
