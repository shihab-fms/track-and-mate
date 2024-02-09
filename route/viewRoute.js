const express = require('express');
const viewController = require('../controller/viewController');

const Router = express.Router();

Router.route('/').get(viewController.regClient);
Router.route('/clients').get(viewController.regClient);
Router.route('/thanks').get(viewController.returnClient);

module.exports = Router;
