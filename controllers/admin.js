const { Product, ProductMongo } = require( "../models/Product");

function addProductPage(request, response, next) {
    response.render('admin/add-product', { 
        pageTitle: 'Add Product', 
        activePage: 'Add Product' 
    });
}

function editProductPage(request, response, next) {
    const product_id = request.params.productId;
    Product.findByPk(product_id).then(product => {
        response.render('admin/add-product', {
            pageTitle: product.title,
            activePage: 'Edit Product',
            product: product
        });
    }).catch(error => {
        console.log(error);
    })
}

function editProduct(request, response, next) {
    const product_id = request.params.productId;
    
    Product.findByPk(product_id).then(product => {
        product.title = request.body.title;
        product.picture = request.body.picture;
        product.amount = request.body.amount;
        product.description = request.body.description;
        return product.save();
    }).then(() => {
        response.redirect('/admin/products');
    }).catch(error => {
        console.log(error);
    })
}

function postProduct(request, response, next) {
    // request.user.createProduct({
    //     title: request.body.title,
    //     picture: request.body.picture,
    //     amount: request.body.amount,
    //     description: request.body.description
    // }).then(product => {
    //     response.redirect('/products');
    // }).catch(error => {
    //     console.log(error);
    // })

    const product = new ProductMongo(
        request.body.title,
        request.body.picture,
        request.body.amount,
        request.body.description
    );
    product.save().then(() => {
        response.redirect('/products');
    }).catch(error => {
        console.log(error);
    });
}

function deleteProduct(request, response, next) {
    const product_id = request.params.productId;
    Product.findByPk(product_id).then(product => {
        return product.destroy();
    }).then(() => {
        response.redirect('/admin/products');
    }).catch(error => {
        console.log(error);
    });
}

function listProductPage(request, response, next) {
    // Product.findAll().then(products => {
    //     response.render('admin/list-product', {
    //         pageTitle: 'Admin Products',
    //         activePage: 'Admin Products',
    //         products: products
    //     });
    // }).catch(error => {
    //     console.log(error);
    // });

    ProductMongo.fetchAll().then(products => {
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