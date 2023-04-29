function getLoginPage(request, response, next) {
    response.render('authentication/login', {
        pageTitle: 'Login',
        activePage: 'Login',
        isAuthenticated: request.user ? true : false
    });
}

function postLogin(request, response, next) {
    request.session.email = request.body.email;
    response.redirect('/products');
}

module.exports = {
    getLoginPage: getLoginPage,
    postLogin: postLogin
};
