const { Router } = require('express');
const { usersController } = require('../controllers/usersController');
const usersRouter = new Router();

usersRouter.get('/', usersController.getUsers); 
usersRouter.get('/:id', usersController.getUserDetails);  
usersRouter.patch('/:id', usersController.editUserDetails);
usersRouter.delete('/:id', usersController.deleteUser); 
usersRouter.post('/:id/activites', usersController.addActivity);

module.exports = { usersRouter };
