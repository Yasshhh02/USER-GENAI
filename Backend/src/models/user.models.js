const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique : [true,"This Username is already Taken"], 
        required: true,
    },
    email:{
        type:String,
        unique:[true,"Account Already Exists With This Email Address"],
        required :true,
    },
    password:{
        type: String,
        required:true,
    }
})

const userModel = mongoose.model('users',userSchema)

module.exports = userModel;