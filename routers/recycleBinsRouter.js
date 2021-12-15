const { Router } = require('express');
const { RecycleBinsController } = require('../controllers/recycleBinsController');
const RecycleBinsRouter = new Router();
//*******************VIEW**************************\\
RecycleBinsRouter.get('/', RecycleBinsController.getRecycleBins); 
RecycleBinsRouter.get('/:id', RecycleBinsController.getRecycleBinDetails);  
//*******************ADD&EDIT**************************\\
RecycleBinsRouter.patch('/:id', RecycleBinsController.editRecycleBinDetails); 
RecycleBinsRouter.post('/', RecycleBinsController.addRecycleBin); 
RecycleBinsRouter.delete('/:id', RecycleBinsController.deleteRecycleBin); 
module.exports = { RecycleBinsRouter };

