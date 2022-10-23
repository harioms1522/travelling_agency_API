const jwt = require("jsonwebtoken")
const {promisify} = require("util")

const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
 
// models
const User = require("../models/userModel")

// 
const signToken = id => jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRY
    })

exports.signup =  catchAsync(async (req,res,next)=>{
    const newUser = await User.create({
        name:req.body.name,
        email: req.body.email,
        password:req.body.password,
        passwordConfirm : req.body.passwordConfirm 
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

    // We are explicetly getting the password field 
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
    console.log(decoded)


    // 3) check if user still exists


    // 4) check if user changed pass after the token was issued

    next()
})