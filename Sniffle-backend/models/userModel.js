const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an email."],
        unique: true
    },
    name: {
        type: String,
        required: [true, "Please provide a name."],
    },
    password: {
        type: String,
        minLength: [8, "Password must be at least 8 characters long."],
        required: [true, "Please provide a password."],
        select: false
    },
    photo: String,
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12)
    next()
})

userSchema.methods.checkPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}


const User = mongoose.model('User',userSchema)

module.exports = User