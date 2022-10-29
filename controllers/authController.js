const jwt = require("jsonwebtoken")
const {promisify} = require("util")

const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const sendEmail = require("../utils/email")
 
// models
const User = require("../models/userModel")
const { nextTick } = require("process")

// 
const signToken = id => jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRY
    })

exports.signup =  catchAsync(async (req,res,next)=>{
    const newUser = await User.create({
        name:req.body.name,
        email: req.body.email,
        password:req.body.password,
        passwordConfirm : req.body.passwordConfirm,
        role: req.body.role
    })

    // Sign a token
    const token = signToken(newUser._id)

    res.status(200).json({
        status:"success",
        token,
        data:{
            user: newUser
        }
    })
}) 

exports.login = catchAsync(async (req,res,next)=>{
    const { email, password } = req.body

    // 1) if email and password exists 
    if(!email || !password){
       return next(new AppError("Please provide email and password!", 400))
    }

    // 2) user exists and password is correct

    // We are explicetly getting the password field || select : false in model
    const user = await User.findOne({email}).select("+password")

    if(!user || ! await user.correctPass(password, user.password)){
        return next(new AppError("Incorrect email or password!", 400))
    }

    // 3) send token to client
    const token = signToken(user._id)
    res.status(200).json({
        status:"success",
        token
    })
})


exports.protect = catchAsync(async (req,res,next)=>{
    // 1) get token and check if there
    let token;

    // bearer convention to be followed
     if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]
     }
    // 2) verify token
    if(!token){
        return next(new AppError("Not logged in! Please log in", 401))
    }

    // callback based function so we should promisify it
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // 3) check if user still exists
    const freshUser = await User.findById(decoded.id)
    if(!freshUser){
        return next(new AppError("User that belongs to the token, doesn't exists!", 401))
    }

    // 4) check if user changed pass after the token was issued
    if(freshUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError("Password was already changed! Please log in again", 401))
    }

    req.user = freshUser
    next()
})

// Authorization:
exports.restrictTo = function(...roles){
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new AppError("You are not allowed to perform this action", 403))
        }
        next()
    }
}

exports.forgotPassword = catchAsync(async (req, res, next)=>{
    // 1) get user based on email
    const user = await User.findOne({email: req.body.email})
    if(!user){
        return next(new AppError("There is no user with this email address", 404))
    }

    // 2) generate token 
    const resetToken = user.createPasswordResetToken()
    // We modified data here we should now save it as well
    // Now mongose will want use to give all the data before saving it because of validations like password
    await user.save({ validateBeforeSave: false })


    // 3) send it back as an email
    
})
exports.resetPassword = (req, res, next) => {
    
}