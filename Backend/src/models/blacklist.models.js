const mongoose = require('mongoose')

const blackTokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,"Token is Required to be Added in Blacklist"]
    }
},
{
    timestamps:true
})

const tokenBlacklistModel = mongoose.model('blacklistTokens',blackTokenSchema)

module.exports = tokenBlacklistModel