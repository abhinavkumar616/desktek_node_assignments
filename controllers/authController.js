const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { name, mobile, password } = req.body;
  if (!name || !mobile || !password) {
    return res.status(400).send({
      status: 400,
      message: "Kindly provide all user details"
    })
  }
  try {
    let user = await User.findOne({ mobile });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    if (mobile.length !== 10) {
      return res.status(400).send({
        status: "400",
        message: "Mobile No should be exactly 10 digits"
      })
    }
    

    user = new User({
      name,
      mobile,
      password,
    });
    await user.save();
    const payload = {
      user: {
        id: user.id,
      },
    };
    console.log("payload----", payload);
    jwt.sign(payload, 'yourJWTSecret', {
      expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
    }, (err, token) => {
      if (err) throw err;
      res.status(201).send({
        status: 201,
        message: "User Register Successfully",
        token
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      error:err.message,
      message:"Server error"
    });
  }
};

exports.login = async (req, res) => {
  const { mobile, password } = req.body;
  if (!mobile || !password) {
    return res.status(400).send({
      status: 400,
      message: "Kindly enter mobile & password"
    })
  }
  try {
    let user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(payload, 'yourJWTSecret',
      {
        expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
      }, (err, token) => {
        if (err) throw err;
        res.status(200).send({
          status: "200",
          message: "User Logged In Successfully",
          token
        });
      });
  } 
  catch (err) {
    console.error(err.message);
    res.status(500).send({
      error:err.message,
      message:"Server error"
    });
  }
};
