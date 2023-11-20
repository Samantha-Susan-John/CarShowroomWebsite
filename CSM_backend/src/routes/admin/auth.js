const express = require('express');
const { signup, signin } = require('../../controllers/admin/auth');
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../../validators/auth');
const router = express.Router(); 


router.post('/admin/signup' ,validateSignupRequest, isRequestValidated, signup);
router.post('/admin/signin' ,validateSigninRequest, isRequestValidated, signin);

module.exports = router;

// exports.requireSignin = (req, res, next) => {
//     const token = req.headers.authorization.split(" ")[1];
//     try {
//       const user = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = user;
//       next();
//     } catch (error) {
//       console.error(error); // Log the error for debugging purposes
//       return res.status(401).json({
//         message: 'Unauthorized'
//       });
//     }
//   };