const bcrypt = require('bcryptjs');

const User = require('../models/User');

function getLoginPage(request, response, next) {
    response.render('authentication/login', {
        pageTitle: 'Login',
        activePage: 'Login',
        isAuthenticated: request.user ? true : false
    });
}

function postLogin(request, response, next) {
    const email = request.body.email;
    const password = request.body.password;

    // First find a user with the email provided
    User.findOne({ email: email }).then(user => {
        // If user is not found, redirect to the login page
        if(!user) {
            console.log('User not found in database.');
            return response.redirect('/login');
        }
        else {
            // If user is found, check if password matches
            bcrypt.compare(password, user.password).then(password_match => {
                // If password also match, login user and redirect to products page
                if(password_match) {
                    request.session.email = email;
                    return response.redirect('/products');
                }
                // If password does not match, redirect to login page
                else {
                    console.log('Invalid credentials.');
                    return response.redirect('/login');
                }
            })
        }
    }).catch(error => {
        console.log(error);
    })
}

function postLogout(request, response, next) {
    request.session.destroy(() => {
        response.redirect('/products');
    })
}

function getSignupPage(request, response, next) {
    response.render('authentication/signup', {
        pageTitle: 'Signup',
        activePage: 'Signup',
        isAuthenticated: request.user ? true : false
    });
}

function postSignup(request, response, next) {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const confirmPassword = request.body.confirmPassword;

    // First check if the user already exists in the database
    User.findOne({ email: email }).then(user => {
        // If user is present in the database, then redirect to the signup page
        if(user) {
            return response.redirect('/signup');
        }
        // If user is not present in the database, then encrypt the password and store in database
        else {
            bcrypt.hash(password, 12).then(encrypted_password => {
                const new_user = new User({
                    name: name,
                    email: email,
                    password: encrypted_password,
                    cart: { items: [] }
                });
                return new_user.save();
            }).then(() => {
                return response.redirect('/login');
            })
        }
    }).catch(error => {
        console.log(error);
    })
}

module.exports = {
    getLoginPage: getLoginPage,
    postLogin: postLogin,
    postLogout: postLogout,
    getSignupPage: getSignupPage,
    postSignup: postSignup
};
