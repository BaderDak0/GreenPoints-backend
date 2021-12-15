const { Router } = require('express');
const { UsersController } = require('../controllers/usersController');
const UsersRouter = new Router();
//*******************VIEW**************************\\
UsersRouter.get('/', UsersController.getUsers); 
UsersRouter.get('/:id', UsersController.getUserDetails);  
//*******************ADD&EDIT**************************\\
UsersRouter.patch('/:id', UsersController.editUserDetails); 
UsersRouter.post('/', UsersController.addUser); 
UsersRouter.delete('/:id', UsersController.deleteUser); 
module.exports = { UsersRouter };

