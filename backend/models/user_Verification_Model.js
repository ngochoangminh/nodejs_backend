const mongoose = require('mongoose');

const UserVerificationSchema = new mongoose.Schema({
    user_id: String,
    unique_string: String,
    create_date: Date,
    expried_time: Date,
});

module.exports = mongoose.model("UserVerification", UserVerificationSchema);