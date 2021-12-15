const { Router } = require('express');
const { ItemsController } = require('../controllers/itemsController');
const ItemsRouter = new Router();
//*******************VIEW**************************\\
ItemsRouter.get('/', ItemsController.getItems); 
ItemsRouter.get('/:id', ItemsController.getItemDetails);  
//*******************ADD&EDIT**************************\\
ItemsRouter.patch('/:id', ItemsController.editItemDetails); 
ItemsRouter.post('/', ItemsController.addItem); 
ItemsRouter.delete('/:id', ItemsController.deleteItem); 
module.exports = { ItemsRouter };

