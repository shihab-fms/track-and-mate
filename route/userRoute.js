const express = require('express');

const authController = require('../controller/authController');

const Router = express.Router();

Router.route('/signup').post(authController.signUP);
Router.route('/login').post(authController.login);
Router.route('/logout').get(authController.logout);

// Router.use(authController.protect);
Router.route('/allusers').get(authController.protect, authController.allUser);

module.exports = Router;
