function error(request, response, next) {
    response.status(404).render('error', {
        pageTitle: 'Not Found',
        activePage: 'Error',
        isAuthenticated: request.user ? true : false,
        loggedInUsername: request.user ? request.user.name : undefined,
        isAdminUser: true
    });
}

module.exports = error;
