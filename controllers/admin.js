const Product = require( "../models/Product");

function addProductPage(request, response, next) {
    response.render('admin/add-product', { 
        pageTitle: 'Add Product', 
        activePage: 'Add Product' 
    });
}

function editProductPage(request, response, next) {
    const product_id = request.params.productId;
    Product.getProductById(product_id).then(([data, field_data]) => {
        response.render('admin/add-product', {
            pageTitle: data[0].title,
            activePage: 'Edit Product',
            product: data[0]
        });
    }).catch(error => {
        console.log(error);
    })
}

function editProduct(request, response, next) {
    const product_id = request.params.productId;
    
    Product.updateProductById(
        product_id,
        request.body.title,
        request.body.picture,
        request.body.amount,
        request.body.description
    ).then(() => {
        response.redirect('/admin/products');
    }).catch(error => {
        console.log(error);
    })
}

function postProduct(request, response, next) {
    Product.addProduct(
        request.body.title,
        request.body.picture,
        request.body.amount,
        request.body.description
    ).then(() => {
        response.redirect('/products');
    }).catch(error => {
        console.log(error);
    })
}

function deleteProduct(request, response, next) {
    const product_id = request.params.productId;
    Product.deleteProductById(product_id).then(() => {
        response.redirect('/admin/products');
    }).catch(error => {
        console.log(error);
    });
}

function listProductPage(request, response, next) {
    Product.findAll().then(products => {
        response.render('admin/list-product', {
            pageTitle: 'Admin Products',
            activePage: 'Admin Products',
            products: products
        });
    }).catch(error => {
        console.log(error);
    })
}

module.exports = {
    addProductPage: addProductPage,
    postProduct: postProduct,
    listProductPage: listProductPage,
    editProductPage: editProductPage,
    editProduct: editProduct,
    deleteProduct: deleteProduct
}