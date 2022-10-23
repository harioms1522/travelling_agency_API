const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[true, "Please tell us your name!"]
    },
    email: {
        type: String,
        required:[true,"Email required!"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,"Please provide a valid email."]
    },
    photo: String,
    password: {
        type: String,
        required:[true, "Provide a password"],
        minLength:8,
        select:false
    },
    passwordConfirm: {
        type: String,
        required:[true, "Provide a password"],
        minLength:8,
        // validator to check if both the passwords are equal
        validate:{
            // this only works with CREATE and SAVE NOTE:
            validator:function(el){
                return el === this.password
            },
            message:"Confirm Password doesn't match password!"
        },
    }
})

// Mongoose middlewares
userSchema.pre("save", async function(next){
    // we use it if password is modified
    if(!this.isModified("password")) return next()

    // encrypting password
    this.password = await bcrypt.hash(this.password, 12) //12 is salt like seed 
    // delete  field set it to undefined
    this.passwordConfirm = undefined

    next()
})

// instance method
userSchema.methods.correctPass = async function(clientPass, passDB){
    return await bcrypt.compare(clientPass, passDB)
}




const User = mongoose.model("User",userSchema)

module.exports = User
