const { Router } = require('express');
const { authController } = require('../controllers/authController');
const authController = new Router();

authController.post('/signup', authController.signup); 
authController.post('/login', authController.login);

module.exports = { authController };
