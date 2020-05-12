var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//page schema
var UserSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        //index: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        // index: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
});

var user = module.exports = mongoose.model('User', UserSchema);