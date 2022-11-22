const asyncHanlder = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const genrateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

//register user
const registerUser = asyncHanlder(async (req, res) => {
  const { name, email, password } = req.body;

  //validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('please fill required fields');
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error('password must be upto 6 characters');
  }
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Email has been registered with');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  //genrate token for the user
  const token = genrateToken(user._id);

  //send http-only cookie | send to frontend

  res.cookie('token', token, {
    path: '/',
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1 day
    sameSite: 'none',
    secure: true,
  });

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error('invalid user data');
  }
});

//login user

const loginUser = asyncHanlder(async (req, res) => {
  const { email, password } = req.body;

  //validate

  if (!email || !password) {
    res.status(400);
    throw new Error('Please add amail and password');
  }
  //if user exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error('User not found. please sign up');
  }
  //user exixts, check password
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

    //genrate token for the user
    const token = genrateToken(user._id);

    //send http-only cookie | send to frontend
  
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), //1 day
      sameSite: 'none',
      secure: true,
    });

  if (user && passwordIsCorrect) {
    const { _id, name, email, photo, phone, bio} = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error('invalid email or password');
  }
});
//logout user

const logout = asyncHanlder( async (req,res) => {
    res.cookie('token', " ", {
        path: '/',
        httpOnly: true,
        expires: new Date(0), 
        sameSite: 'none',
        secure: true,
      });
      return res.status(200).json({ message: "successfully logged ouy"})
})
//get user data
const getUser = asyncHanlder(async (req,res) => {
    const user = await User.findById(req.user._id)

    if(user) {
        const { _id, name, email, photo, phone, bio} = user;
        res.status(201).json({
          _id,
          name,
          email,
          photo,
          phone,
          bio,
        });
      } else {
        res.status(400);
        throw new Error('User not Found!');
      }
    
})

//get login status

const loginStatus =asyncHanlder( async (req, res) => {
    const token = req.cookies.token;
    if(!token) {
        return res.json(false)
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if(verified) {
        return res.json(true);
    }
})
module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
};
