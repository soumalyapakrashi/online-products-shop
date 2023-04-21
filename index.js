const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config({
    path: path.resolve(__dirname, '..', '.env')
});

const shop_routes = require('./routes/shop');
const admin_routes = require('./routes/admin');
const error_route = require('./routes/error');
const { mongoConnect } = require('./utils/database');
const { User } = require('./models/User');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// Set the public folder to be the folder for static files
app.use(express.static('./public'));
// Set up the body parser for parsing forms
app.use(bodyParser.urlencoded({ extended: false }));

// Add the dummy user to the request so that it can be accessed from other parts
app.use((request, response, next) => {
    User.findById("642b066945e3834aca674893").then(user => {
        request.user = new User(user.name, user.email, user.cart, user._id.toString());
        next();
    }).catch(error => {
        console.log(error);
    })
})

app.use('/admin', admin_routes);
app.use(shop_routes);

// Default Not Found route
app.use(error_route);

// Connect to MongoDB and on successful connection, start the server.
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.rys2m9o.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`).then(client => {
    app.listen(3000);
}).catch(error => {
    console.log(error);
});
