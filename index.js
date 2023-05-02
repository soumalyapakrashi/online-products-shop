const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

require('dotenv').config({
    path: path.resolve(__dirname, '.', '.env')
});

const csrfProtection = csrf();

const shop_routes = require('./routes/shop');
const admin_routes = require('./routes/admin');
const auth_routes = require('./routes/authentication');
const error_route = require('./routes/error');
const User = require('./models/User');

const app = express();

// Setup the view engine and the views route
app.set('view engine', 'ejs');
app.set('views', 'views');

// Setup MongoDB Store with sessions
const store = MongoDBStore({
    uri: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.rys2m9o.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`,
    collection: 'sessions'
});

// Set up middleware to initialize sessions for user
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}));

// Set the public folder to be the folder for static files
app.use(express.static('./public'));

// Set up the body parser for parsing forms
app.use(bodyParser.urlencoded({ extended: false }));

// Register middleware for CSRF token
app.use(csrfProtection);

// Put the csrfToken variable in all the views
app.use((request, response, next) => {
    response.locals.csrfToken = request.csrfToken();
    next();
})

// Add the logged in user to the request so that it can be accessed from other parts
app.use((request, response, next) => {
    if(request.session.email !== undefined) {
        User.find({ email: request.session.email }).then(users => {
            request.user = users[0];
            next();
        }).catch(error => {
            console.log(error);
        })
    }
    else {
        next();
    }
})

app.use('/admin', admin_routes);
app.use(shop_routes);
app.use(auth_routes);

// Default Not Found route
app.use(error_route);

// Connect to MongoDB and on successful connection, start the server.
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.rys2m9o.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`).then(client => {
    // Once connected to database, create a new user if one is already not created.
    User.findOne().then(user => {
        if(!user) {
            const user = new User({
                name: "Soumalya",
                email: "soumalyapakrashi@gmail.com",
                cart: {
                    items: []
                }
            });
            return user.save();
        }
        else {
            return user;
        }
    }).then(() => {
        // Once the default user is also created, start the server.
        app.listen(3000);
    })
}).catch(error => {
    console.log(error);
});
