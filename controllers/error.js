function error(request, response, next) {
    response.status(404).render('error', { pageTitle: 'Not Found', activePage: 'Error' });
}

module.exports = error;
