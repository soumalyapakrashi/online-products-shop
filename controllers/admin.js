const { Product } = require( "../models/Product");

function addProductPage(request, response, next) {
    response.render('admin/add-product', { 
        pageTitle: 'Add Product', 
        activePage: 'Add Product' 
    });
}

function editProductPage(request, response, next) {
    const product_id = request.params.productId;

    Product.findById(product_id).then(product => {
        response.render('admin/add-product', {
            pageTitle: product.title,
            activePage: 'Edit Product',
            product: product
        });
    }).catch(error => {
        console.log(error);
    });
}

function editProduct(request, response, next) {
    const product_id = request.params.productId;

    const updated_product = new Product(
        request.body.title,
        request.body.picture,
        request.body.amount,
        request.body.description,
        request.user._id,
        product_id
    );

    updated_product.save().then(() => {
        response.redirect('/admin/products');
    }).catch(error => {
        console.log(error);
    });
}

function postProduct(request, response, next) {
    const product = new Product(
        request.body.title,
        request.body.picture,
        request.body.amount,
        request.body.description,
        request.user._id
    );
    product.save().then(() => {
        response.redirect('/products');
    }).catch(error => {
        console.log(error);
    });
}

function deleteProduct(request, response, next) {
    const product_id = request.params.productId;

    Product.deleteById(product_id).then(() => {
        response.redirect('/admin/products');
    }).catch(error => {
        console.log(error);
    });
}

function listProductPage(request, response, next) {
    Product.fetchAll().then(products => {
        response.render('admin/list-product', {
            pageTitle: 'Admin Products',
            activePage: 'Admin Products',
            products: products
        });
    }).catch(error => {
        console.log(error);
    });
}

module.exports = {
    addProductPage: addProductPage,
    postProduct: postProduct,
    listProductPage: listProductPage,
    editProductPage: editProductPage,
    editProduct: editProduct,
    deleteProduct: deleteProduct
}
