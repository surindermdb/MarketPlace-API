const mongoose = require('mongoose');
const passport = require('passport');  // authentication
const passportLocalMongoose = require('passport-local-mongoose');
const connectEnsureLogin = require('connect-ensure-login');
const bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

const User = new Schema({
    username: String,
    passwordHash: String
});

User.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

User.virtual("password").set(function (value) {
    this.passwordHash = bcrypt.hashSync(value, 12);
});
// Export Model
User.plugin(passportLocalMongoose);

let userColl = mongoose.model("User", User); //create model/schema using mongoose

module.exports = {
    userColl
}