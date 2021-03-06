const express = require('express');
//const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.post('/signup', authController.signup);
Router.post('/login', authController.login);
Router.get('/logout', authController.protect, authController.logout);

// Router.patch(
//     '/changeAdminStatus',
//     authController.protect,
//     authController.restrictTo('administrator', 'director'),
//     userController.changeAdminStatus
// );

// Router.get('/correctData', userController.correctData);

// Router.route('/:userId').get(authController.protect, userController.getUser);

// // Router.route('/otp/resend', authController.sendOtp);
// // Router.route('/otp/reset', authController.createOtp);
// Router.route('/verifyEmail/:code').get(authController.verifyOtp);

// Router.route('/').get(authController.protect, userController.getAllUsers);
//.post(authController.signup)
// .patch(userController.updateUser)
// .delete(userController.deleteUser);

// Router.route('/:id').get(userController.get)

module.exports = Router;
