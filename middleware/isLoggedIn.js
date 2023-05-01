// This middleware only allows requests to proceed if current user is logged in
module.exports = (request, response, next) => {
    if(request.session.email) {
        next();
    }
    else {
        response.redirect('/login');
    }
}
