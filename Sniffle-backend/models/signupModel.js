const mongoose = require('mongoose');

const signupModel = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        unique: true
    },
    expiresAt: {
        type: Date,
    }
})

const SignUpCode = mongoose.model('SignUpCode', signupModel);
module.exports = SignUpCode