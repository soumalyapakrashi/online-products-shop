const express = require('express');
const bodyParser = require('body-parser');

const shop_routes = require('./routes/shop');
const admin_routes = require('./routes/admin');
const error_route = require('./routes/error');
const { sequelize, mongoConnect } = require('./utils/database');
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const CartItem = require('./models/CartItem');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// Set the public folder to be the folder for static files
app.use(express.static('./public'));
// Set up the body parser for parsing forms
app.use(bodyParser.urlencoded({ extended: false }));

// Add the dummy user to the request so that it can be accessed from other parts
app.use((request, response, next) => {
    User.findByPk(1).then(user => {
        request.user = user;
        next();
    }).catch(error => {
        console.log(error);
    })
})

app.use('/admin', admin_routes);
app.use(shop_routes);

// Default Not Found route
app.use(error_route);

// Set up database associations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
User.hasMany(Order);
Product.belongsToMany(Order, { through: OrderItem });
Order.belongsToMany(Product, { through: OrderItem });

// Sync model with the database and on success, start the server
sequelize.sync().then(() => {
    // First get the default user created for now
    return User.findByPk(1);
}).then(user => {
    // If no default user is found, then create one. Else return the existing one.
    if(!user) {
        return User.create({
            name: 'Soumalya',
            email: 'soumalyapakrashi@gmail.com'
        });
    }
    return user;
}).then(user => {
    // Check if cart already exists for user
    user.getCart().then(cart => {
        // If cart does not exist, then create cart. Else do not.
        // This is because every individual user will have only one Cart.
        if(cart === null) {
            return user.createCart();
        }
        else {
            return cart;
        }
    }).then(() => {
        // Once user and cart has been created, connect to the MongoDB database
        return mongoConnect()
    }).then(client => {
        console.log(client);
        app.listen(3000);
    }).catch(error => {
        console.log(error);
    });
}).catch(error => {
    console.log(error);
});
