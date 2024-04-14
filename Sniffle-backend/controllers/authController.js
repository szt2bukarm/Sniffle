const User = require('../models/userModel');
const SignUpCode = require('../models/signupModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const randomString = require('randomized-string')
const Email = require('../utils/email');
const { promisify } = require('util');

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}

const createSendToken = (user,statusCode,res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

exports.signup = catchAsync(async (req,res,next) => {
    const user = await SignUpCode.findOne({email: req.body.email});

    // check if code or user exists
    if(!user || !req.body.code) {
        return next(new AppError('This email has no sign-up token or no code was provided.',400))
    }

    // check if code is correct
    if(req.body.code != user.code) {
        return next(new AppError('Incorrect code',400))
    }

    // check if code is expired
    if(Date.now() > user.expiresAt) {
        await SignUpCode.findOneAndDelete({email: req.body.email})
        await generateToken(req,res,next)
        return next(new AppError('This token has expired. A new one was sent.',400))
    }

    // register user
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    })

    await SignUpCode.findOneAndDelete({email: req.body.email});

    createSendToken(newUser,201,res)
})


exports.generateSignupToken = catchAsync(async (req,res,next) => {
    // check if email is taken
    if(await User.findOne({email: req.body.email})) {
        return next(new AppError('This email address is already taken',400))
    }

    // return token if there's already one for the user
    const tokenExists = await SignUpCode.findOne({email: req.body.email});

    // check if token is expired
    if(tokenExists && Date.now() > tokenExists.expiresAt) {
        await SignUpCode.findOneAndDelete({email: req.body.email});
        const token = await generateToken(req,res,next)
        await new Email(req.body.email, token.code).sendCode()
        return res.status(200).json({
            status: 'success',
            data: {
                token
            }
        })
    }

    // return token
    if(tokenExists) {
        return res.status(200).json({
            status: 'success',
            data: {
                token: tokenExists.code
            }
        })
    }

    // create token if nothing matches
    const token = await generateToken(req,res,next)
    await new Email(req.body.email, token.code).sendCode()
    
    res.status(200).json({
        status: 'success',
        data: {
            token
        }
    })
})

const generateToken = async function(req,res,next) {
    // create code
    const token = await SignUpCode.create({
        email: req.body.email,
        code: randomString.generate(6),
        expiresAt: Date.now() + 10 * 60 * 1000
    })
    return token
}

exports.login = catchAsync(async (req,res,next) => {
    const {email,password} = req.body;

    if(!email || !password) {
        return next(new AppError('Please provide an email or password',400))
    }

    const user = await User.findOne({email}).select('+password');
    if(!user || !(await user.checkPassword(password,user.password))) {
        return next(new AppError('Incorrect email or password',401))
    }
    createSendToken(user,200,res)
})

exports.protect = catchAsync(async (req,res,next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token && req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if(!token) {
        return next(new AppError('You are not logged in. Please log in to get access',401))
    }

    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    const currentUser = await User.findById(decoded.id)
    if(!currentUser) {
        return next(new AppError('No user found with that ID.',401))
    }

    req.user = currentUser
    next()
})

exports.restrictTo = (...roles) => {
    return (req,res,next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action',403))
        }
        next();
    }
}