const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require('../models/blacklist.models')

async function authUser(req, res, next) {
    console.log("COOKIES RECEIVED:", req.cookies);
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Token Not Provided."
            });
        }

        const isTokenBlacklisted = await tokenBlacklistModel.findOne({
            token
        });

        if (isTokenBlacklisted) {
            return res.status(401).json({
                message: "Token is Invalid"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}

module.exports = { authUser };