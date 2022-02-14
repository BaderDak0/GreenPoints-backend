const Coupon = require('../models/coupons');
const { infoLogger, errorLogger } = require("../logs/logs");

exports.couponService = {
    async getCoupon(id) {
        let coupon;
        try {
            coupon = await Coupon.findOne({ _id: id });
        } catch (err) {
            errorLogger.error(`Error Getting coupon from db:${err}`);
            return null;
        }
        if (coupon) {
            return coupon;
        }
        else {
            errorLogger.error("Wrong coupon id please enter correct id");
            return null;
        }
    },
    async updateCoupon(id, coupon) {
        infoLogger.info("Updating a coupon");
        let result;
        try {
            result = await Coupon.updateOne({ _id: id }, coupon);
        } catch (err) {
            errorLogger(`error updating coupon ${id}: ${err}`);
            return false;
        }
        if (!result) {
            return false;
        }
        if (result.matchedCount > 0) {
            infoLogger.info(`Updating coupon no:${id} is successfully`);
            return true;
        }
        else {
            errorLogger.error("Wrong coupon id please enter correct id");
            return false;
        }
    }
}