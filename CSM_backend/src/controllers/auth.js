const User = require('../models/user');
const jwt = require('jsonwebtoken');


exports.signup = (req, res) => {



    User.findOne({ email: req.body.email })
  .then(user => {
    if (user) {
      return res.status(400).json({
        message: 'User already registered'
      });
    }
    const {
      firstName,
      lastName,
      email,
      password
    } = req.body;
    const _user = new User({
      firstName,
      lastName,
      email,
      password,
      username: Math.random().toString()
    });
    _user.save()
      .then(data => {
        return res.status(201).json({
          message : 'User created succesfully'
        });
      })
      .catch(error => {
        return res.status(400).json({
          message: 'User not created'
        });
      });
  })
  .catch(error => {
    return res.status(400).json({
      message: 'Something wrong'
    });
  });
} 


exports.signin = (req, res) => {


  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        if (user.authenticate(req.body.password)) {
          const token = jwt.sign({ _id: user._id }, "turtle", { expiresIn: '1h' });   //JWT_SECRET not loading from .env file so hardcoding turtle
          const { _id, firstName, lastName, email, role, fullName } = user;
          res.status(200).json({
            token,
            user: {
              _id, firstName, lastName, email, role, fullName
            }
          });
        } else {
          res.status(400).json({
            message: 'Invalid Password'
          });
        }
      } else {
        return res.status(400).json({ message: 'User not found' });
      }
    })
    .catch(error => {
      console.error(error);
      return res.status(400).json({ message: 'Something  wrong' });
    });
};

exports.requireSignin = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, process.env.JWT_SECRET);
  req.user = user;
  next();
  //jwt.decode()
}