const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String },
    password: { type: String },

    // locations: { type: Array },
    // activity: {type:String},

    locations: [{
        latitude: String,
        longitude: String,
        date: String,
        activity: String
    }]

}, {
    timestamps: true
})
module.exports = mongoose.model("usersData", userSchema);
