const Coupon = require('../models/coupons');
const { infoLogger, errorLogger } = require("../logs/logs");
exports.couponsController = {
    getCoupons(req, res) {
        infoLogger.info("Get all Coupons");
        Coupon.find({})
            .then(coupon => {
                infoLogger.info("Success to Get all coupons");
                res.json(coupon)
            })
            .catch(err => {
                errorLogger.error(`Error getting the data from db:${err}`)
                res.status(500).json({ "message": `Error Gets coupons ` });
            });
    },
    getCouponDetails(req, res) {
        infoLogger.info(`Get Coupon id:${req.params.id}`);
        Coupon.findOne({ _id: req.params.id })
            .then((coupon) => {
                if (coupon) {
                    res.json(coupon)
                }
                else {
                    errorLogger.error("Wrong coupon id please enter correct id");
                    res.status(400).json({ "message": "Wrong coupon id please enter correct id" });
                }
            })
            .catch(err => {
                errorLogger.error(`Error Getting coupon from db:${err}`);
                res.status(500).json({ "message": `Error getting coupon ` });
            });
    },
    editCouponDetails(req, res) {
        infoLogger.info("Updating a coupon");
        Coupon.updateOne({ _id: req.params.id }, req.body)
            .then((result) => {
                if (result.matchedCount > 0) {
                    infoLogger.info(`Updating coupon no:${req.params.id} is successfully`);
                    res.json({ "message": `Updating coupon no:${req.params.id} is successfully` });
                }
                else {
                    errorLogger.error("Wrong coupon id please enter correct id");
                    res.status(400).json({ "message": "Wrong coupon id please enter correct id" });
                }
            })
            .catch((err) => res.status(400).json(err));
    },
    addCoupon(req, res) {
        infoLogger.info("Add a coupon");
        if (req.body.name && req.body.info &&
            req.body.code && req.body.imgUrl &&
            req.body.cost) {
            const newCoupon = new Coupon(req.body);
            newCoupon.save()
                .then(result => {
                    infoLogger.info(`Adding coupon  :${req.body.name} is successfully`);
                    res.json(result);
                })
                .catch(err => {
                    errorLogger.error(`Error Adding coupon `);
                    res.status(400).json({ "message": `Error Adding coupon ` });
                });
        }
        else {
            errorLogger.error("Missing Parameters Please send all Parameters ");
            res.status(400).json({ "message": "Missing Parameters Please send all Parameters" });
        }
    },
    deleteCoupon(req, res) {
        infoLogger.info("Delete a coupon");
        Coupon.deleteOne({ _id: req.params.id })
            .then((result) => {
                if (result.deletedCount > 0) {
                    infoLogger.info(`Deleting coupon no:${req.params.id} is successfully`);
                    res.json({ "message": `Deleting coupon no:${req.params.id} is successfully` });
                }
                else {
                    errorLogger.error(`coupon no:${req.params.id} does not exists`);
                    res.status(400).json({ "message": `coupon no:${req.params.id} does not exists` });
                }
            })
            .catch(() => {
                errorLogger.error(`Error Deleting coupon no:${req.params.id} `);
                res.status(400).json({ "message": `Error Deleting coupon no:${req.params.id} ` });
            });
    }
}
