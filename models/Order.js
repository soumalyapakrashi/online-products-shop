const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: String,
        required: true
    },
    products: [{
        type: Object,
        required: true
    }]
});

module.exports = mongoose.model('Order', OrderSchema);
