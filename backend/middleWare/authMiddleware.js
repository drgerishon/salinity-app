const asyncHanlder = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const protect = asyncHanlder( async (req, res, next) => {
    try {
        const token = req.cookies.token
        if(!token) {
            res.status(401)
            throw new Error('not authorise. please log in')
        }
        //verify token

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        //GET user id from token
       const user = await User.findById(verified.id).select("-password")
        if (!user) {
            res.status(401);
            throw new Error("User not found")
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401)
        throw new Error('not authorise. please log in')
    }
})
module.exports = protect