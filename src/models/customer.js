const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerName: { type: String },
    customerPhone: { type: String },
    place: { type: String },
    productName: { type: String },
    status: { type: String },
    description: { type: Array },
    followupDate: { type: Array },
    proposalStatus: { type: String },
    employeeId: { type: String }
}, {
    timestamps: true
})
module.exports = mongoose.model('customerData', customerSchema);
