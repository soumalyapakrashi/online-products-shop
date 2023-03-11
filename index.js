const express = require('express');
const bodyParser = require('body-parser');

const shop_routes = require('./routes/shop');
const admin_routes = require('./routes/admin');
const error_route = require('./routes/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// Set the public folder to be the folder for static files
app.use(express.static('./public'));
// Set up the body parser for parsing forms
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/admin', admin_routes);
app.use(shop_routes);

// Default Not Found route
app.use(error_route);

app.listen(3000);
