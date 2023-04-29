function getLoginPage(request, response, next) {
    response.render('authentication/login', {
        pageTitle: 'Login',
        activePage: 'Login'
    });
}

function postLogin(request, response, next) {
    response.redirect('/products');
}

module.exports = {
    getLoginPage: getLoginPage,
    postLogin: postLogin
};
