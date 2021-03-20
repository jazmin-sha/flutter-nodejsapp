const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String }
}, {
    timestamps: true
})
module.exports = mongoose.model('productData', productSchema)