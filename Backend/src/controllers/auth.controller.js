const userModel = require('../models/user.models')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require('../models/blacklist.models')

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req,res) {
    const{ username, email, password} = req.body;
    if(!username || !email || !password){
        return res.status(400).json({
            message : "Please provide username,email and password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or : [{username} , {email}]
    })
    if (isUserAlreadyExists){
        if(isUserAlreadyExists.username === username){
            return res.status(400).json({
                message:"User Already Exists With this Username"
            })
        }
        return res.status(400).json({
            message:"User Already Exists With this Email Address"
        })
    }
    const hash = await bycrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        {id:user._id, username : user.username},
        process.env.JWT_SECRET,
        {expiresIn : "1d"}

    )

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000
    });
    res.status(201).json({
        message : "User Registered Succesfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }

    })
}
/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */

async function loginUserController(req,res){
    const{email,password} = req.body;

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message : "Inavlid Email or password"
        })
    }

    const isPasswordValid = await bycrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message : "Inavlid Email or password"
        })
    }
    const token = jwt.sign(
        {id:user._id, username : user.username},
        process.env.JWT_SECRET,
        {expiresIn : "1d"}

    )
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000
    });
    res.status(201).json({
        message : "User loggedIn Succesfully",
        user:{
            _id:user._id,
            username:user.username,
            email:user.email
        }

    })
}

/**
 * @name  logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */

async function logoutUserController(req, res) {
    try {
        const token = req.cookies?.token;

        console.log("TOKEN RECEIVED:", token);

        if (!token) {
            return res.status(400).json({
                message: "No token found"
            });
        }

        console.log("Adding token to blacklist...");

        const blacklistedToken = await tokenBlacklistModel.create({
            token: token
        });

        console.log("BLACKLISTED TOKEN:", blacklistedToken);

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });

        return res.status(200).json({
            message: "User Logged Out Successfully"
        });

    } catch (error) {
        console.log("LOGOUT ERROR:", error);

        return res.status(500).json({
            message: "Logout failed",
            error: error.message
        });
    }
}

/**
 * @name getMeController
 * @description get the current logged in user details,expect tokens in the request.
 * @access private
 */
async function getMeController(req,res){
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message : "User Details Fetched Successfully",
        user:{
            id: user._id,
            username: user.username,
            email:user.email

        }
    })

}

module.exports = {registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};