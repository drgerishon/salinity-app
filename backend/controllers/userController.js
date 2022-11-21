const asyncHanlder = require('express-async-handler');
const User = require('../models/userModel');
const { use } = require('../routes/userRoute');
const registerUser = asyncHanlder(async (req, res) => {
    const {name, email, password} = req.body;

    //validation
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("please fill required fields")
    }
    if (password.length <6 ) {
        res.status(400)
        throw new Error("password must be upto 6 characters")
    }
    const userExists = await User.findOne({email})

    if (userExists) {
        res.status(400) 
        throw new Error('Email has been registered with')
    }
    const user = await User.create({
        name,
        email,
        password
    })
    if(user) {
        const {_id, name, email, photo, phone, bio} = user; 
        res.status(201).json({
           _id, name, email, photo, phone, bio
        })
    } else {
        res.status(400)
        throw new Error("invalid user data")
    }
   
});
module.exports = {
  registerUser,
};
