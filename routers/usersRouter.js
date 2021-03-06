const { Router } = require('express');
const { usersController } = require('../controllers/usersController');
const usersRouter = new Router();

usersRouter.get('/', usersController.getUsers); 
usersRouter.get('/:id', usersController.getUserDetails);  
usersRouter.post('/:id/activities', usersController.addActivity);
usersRouter.post('/:id/coupons', usersController.addCoupon);

module.exports = { usersRouter };
