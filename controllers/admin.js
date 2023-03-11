const Product = require( "../models/Product");

function addProductPage(request, response, next) {
    response.render('admin/add-product', { pageTitle: 'Add Product', activePage: 'Add Product' });
}

function postProduct(request, response, next) {
    new Product(request.body.title, request.body.picture, request.body.amount, request.body.description);

    response.redirect('/products');
}

function listProductPage(request, response, next) {
    response.render('admin/list-product', { pageTitle: 'Admin Products', activePage: 'Admin Products', products: Product.getProducts() });
}

module.exports = {
    addProductPage: addProductPage,
    postProduct: postProduct,
    listProductPage: listProductPage
}