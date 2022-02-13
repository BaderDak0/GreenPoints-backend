const { Router } = require('express');
const { couponsController } = require('../controllers/usersController');
const couponsRouter = new Router();

couponsRouter.get('/', couponsController.getCoupons); 
couponsRouter.get('/:id', couponsController.getCouponDetails);  
couponsRouter.patch('/:id', couponsController.editCouponDetails); 
couponsRouter.post('/', couponsController.addCoupon); 
couponsRouter.delete('/:id', couponsController.deleteCoupon); 
module.exports = { couponsRouter };
