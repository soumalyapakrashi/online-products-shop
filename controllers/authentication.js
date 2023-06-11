const path = require('path');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const transport = require('nodemailer-brevo-transport');

require('dotenv').config({
    path: path.resolve(__dirname, '..', '.env')
});

const User = require('../models/User');

const transporter = nodemailer.createTransport(new transport({ apiKey: process.env.BREVO_API_KEY }));

function getLoginPage(request, response, next) {
    // Show invalid credentials flash message if applicable
    let error_message = request.flash('error');
    if(error_message.length > 0) {
        error_message = error_message[0];
    }
    else {
        error_message = null;
    }

    response.render('authentication/login', {
        pageTitle: 'Login',
        activePage: 'Login',
        isAuthenticated: request.user ? true : false,
        message: error_message
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
            request.flash('error', 'Invalid username or password');
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
                    request.flash('error', 'Invalid username or password');
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
    let error_message = request.flash('error');
    if(error_message.length > 0) {
        error_message = error_message[0];
    }
    else {
        error_message = null;
    }

    response.render('authentication/signup', {
        pageTitle: 'Signup',
        activePage: 'Signup',
        isAuthenticated: request.user ? true : false,
        message: error_message
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
            request.flash('error', 'An user with that email already exists.');
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
                response.redirect('/login');

                return transporter.sendMail({
                    from: 'soumalyapakrashi@gmail.com',
                    to: email,
                    subject: 'Welcome to Online Products Shop',
                    html: `
                        <h1>Welcome ${name}</h1>
                        <p>We are excited to welcome you to the <strong>Online Products Shop</strong>.
                        Your account has been successfully created.</p>
                    `
                });
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
