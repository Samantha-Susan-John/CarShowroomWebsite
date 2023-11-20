const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (user) {
        return res.status(400).json({
          message: 'Admin already registered'
        });
      }

      const _user = new User({
        firstName,
        lastName,
        email,
        password,
        username: Math.random().toString(),
        role: 'admin'
      });

      _user.save()
        .then(data => {
          return res.status(201).json({
            message: 'Admin created successfully'
          });
        })
        .catch(error => {
          console.error(error); // Log the error for debugging purposes
          return res.status(500).json({
            message: 'Internal server error'
          });
        });
    })
    .catch(error => {
      console.error(error); // Log the error for debugging purposes
      return res.status(500).json({
        message: 'Internal server error'
      });
    });
};

exports.signin = (req, res) => {
  //const { email, password } = req.body;
  User.findOne({ email: req.body.email })
    .then(user => {
      console.error(user); 
      if (!user || !user.authenticate(req.body.password) || user.role !== 'admin') {
        return res.status(400).json({
          message: 'Invalid credentials'
        });
      }
      console.log(process.env.JWT_SECRET);
      const token = jwt.sign({ _id: user._id }, "turtle", { expiresIn: '1h' });
      const { _id, firstName, lastName, email, role, fullName } = user;
      res.status(200).json({
        token,
        user: {
          _id, firstName, lastName, email, role, fullName
        }
      });
    })
    .catch(error => {
      console.error(error); 
      return res.status(500).json({
        message: 'Internal server error'
      });
    });
};


