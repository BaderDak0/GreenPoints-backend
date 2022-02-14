const Coupon = require('../models/coupons');
const { infoLogger, errorLogger } = require("../logs/logs");
const { userService } = require('../services/userService');

const removeCode = (coupon) => {
    if (coupon) {
        coupon.code = undefined;
    }
    return coupon;
}

exports.couponsController = {
    async getCoupons(req, res) {
        infoLogger.info("Get all Coupons");
        let isMod = false;
        if (req.userId) {
            isMod = await userService.isModerator(req.userId);
        }
        Coupon.find({})
            .then(coupons => {
                infoLogger.info("Success to Get all coupons");
                if (!isMod) {
                    coupons = coupons.map((coupon) => removeCode(coupon));
                }
                res.json(coupons)
            })
            .catch(err => {
                errorLogger.error(`Error getting the data from db:${err}`)
                res.status(500).json({ "message": `Error Gets coupons ` });
            });
    },
    async getCouponDetails(req, res) {
        infoLogger.info(`Get Coupon id:${req.params.id}`);
        let isMod = false;
        if (req.userId) {
            isMod = await userService.isModerator(req.userId);
        }
        Coupon.findOne({ _id: req.params.id })
            .then((coupon) => {
                if (coupon) {
                    if (!isMod)
                        coupon = removeCoupon(coupon);
                    res.json(removeCoupon(coupon))
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
    async editCouponDetails(req, res) {
        infoLogger.info("Updating a coupon");
        let isMod = false;
        if (req.userId) {
            isMod = await userService.isModerator(req.userId);
        }
        if (!isMod) {
            errorLogger.error(`unauthorized user ${req.userId}`);
            res.status(401).json({ "message": "Unauthorized user" });
            return;
        }
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
    async addCoupon(req, res) {
        infoLogger.info("Add a coupon");
        let isMod = false;
        if (req.userId) {
            isMod = await userService.isModerator(req.userId);
        }
        if (!isMod) {
            errorLogger.error(`unauthorized user ${req.userId}`);
            res.status(401).json({ "message": "Unauthorized user" });
            return;
        }
        if (req.body.name && req.body.info &&
            req.body.code && req.body.imgUrl &&
            req.body.cost) {
            const newCoupon = new Coupon({
                name: req.body.name,
                info: req.body.info,
                code: req.body.code,
                imgUrl: req.body.imgUrl,
                cost: req.body.cost,
                owned: req.body.owned ?? false,
            });
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
    async deleteCoupon(req, res) {
        infoLogger.info("Delete a coupon");
        let isMod = false;
        if (req.userId) {
            isMod = await userService.isModerator(req.userId);
        }
        if (!isMod) {
            errorLogger.error(`unauthorized user ${req.userId}`);
            res.status(401).json({ "message": "Unauthorized user" });
            return;
        }
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
