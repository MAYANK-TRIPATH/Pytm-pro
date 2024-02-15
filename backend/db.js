const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String
});

const User = mongoose.model('User', UserSchema);

module.exports = {
    User
};