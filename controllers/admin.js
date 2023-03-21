const Product = require( "../models/Product");

function addProductPage(request, response, next) {
    response.render('admin/add-product', { 
        pageTitle: 'Add Product', 
        activePage: 'Add Product' 
    });
}

function editProductPage(request, response, next) {
    const product_id = request.params.productId;
    const product = Product.getProductById(product_id);

    response.render('admin/add-product', {
        pageTitle: product.title,
        activePage: 'Edit Product',
        product: product
    });
}

function editProduct(request, response, next) {
    const product_id = request.params.productId;
    
    Product.updateProductById(
        product_id,
        request.body.title,
        request.body.picture,
        request.body.amount,
        request.body.description
    );

    response.redirect('/admin/products');
}

function postProduct(request, response, next) {
    new Product(request.body.title, request.body.picture, request.body.amount, request.body.description);

    response.redirect('/products');
}

function deleteProduct(request, response, next) {
    const product_id = request.params.productId;
    console.log(product_id);
    Product.deleteProductById(product_id);
    response.redirect('/admin/products');
}

function listProductPage(request, response, next) {
    Product.getProducts().then(([data, field_data]) => {
        response.render('admin/list-product', {
            pageTitle: 'Admin Products',
            activePage: 'Admin Products',
            products: data
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