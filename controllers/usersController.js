const User = require('../models/users');
const { infoLogger, errorLogger } = require("../logs/logs");
let bcrypt = require('bcryptjs');
const { recycleBinService } = require('../services/recycleBinService');
const { userService } = require('../services/userService');
const { couponService } = require('../services/couponService');

exports.usersController = {
    getUsers(req, res) {
        infoLogger.info("Get all Users");
        if (req.query.sort == "points") {
            infoLogger.info("Success to Get all sort users");
            User.find({}).sort({ points: -1 })
                .then(user => {
                    infoLogger.info("Success to Get all sorted users");
                    res.json(user)
                })
                .catch(err => {
                    errorLogger.error(`Error getting the data from db:${err}`)
                    res.status(500).json({ "message": `Error Gets sorted users  ` });
                });
        } else {
            User.find({})
                .then(user => {
                    infoLogger.info("Success to Get all users");
                    res.json(user)
                })
                .catch(err => {
                    errorLogger.error(`Error getting the data from db:${err}`)
                    res.status(500).json({ "message": `Error Gets users ` });
                });
        }
    },
    getUserDetails(req, res) {
        infoLogger.info(`Get User id:${req.params.id}`);
        User.findOne({ _id: req.params.id })
            .then((user) => {
                if (user) {
                    res.json(user)
                }
                else {
                    errorLogger.error("Wrong user id please enter correct id");
                    res.status(400).json({ "message": "Wrong user id please enter correct id" });
                }
            })
            .catch(err => {
                errorLogger.error(`Error Getting user from db:${err}`);
                res.status(500).json({ "message": `Error getting user ` });
            });
    },
    async editUserDetails(req, res) {
        infoLogger.info("Updating a user");
        if (req.params.id != req.userId) {
            if (req.userId) {
                isMod = await userService.isModerator(req.userId);
            }
            if (!isMod) {
                errorLogger.error(`unauthorized user ${req.userId}`);
                res.status(401).json({ "message": "Unauthorized user" });
                return;
            }
        }
        User.updateOne({ _id: req.params.id }, req.body)
            .then((result) => {

                if (result.matchedCount > 0) {
                    infoLogger.info(`Updating user no:${req.params.id} is successfully`);
                    res.json({ "message": `Updating user no:${req.params.id} is successfully` });
                }
                else {
                    errorLogger.error("Wrong user id please enter correct id");
                    res.status(400).json({ "message": "Wrong user id please enter correct id" });
                }
            })
            .catch((err) => res.status(400).json(err));
    },
    async deleteUser(req, res) {
        infoLogger.info("Delete a user");
        if (req.params.id != req.userId) {
            if (req.userId) {
                isMod = await userService.isModerator(req.userId);
            }
            if (!isMod) {
                errorLogger.error(`unauthorized user ${req.userId}`);
                res.status(401).json({ "message": "Unauthorized user" });
                return;
            }
        }
        User.deleteOne({ _id: req.params.id })
            .then((result) => {
                if (result.deletedCount > 0) {
                    infoLogger.info(`Deleting user no:${req.params.id} is successfully`);
                    res.json({ "message": `Deleting user no:${req.params.id} is successfully` });
                }
                else {
                    errorLogger.error(`user no:${req.params.id} does not exists`);
                    res.status(400).json({ "message": `user no:${req.params.id} does not exists` });
                }
            })
            .catch(() => {
                errorLogger.error(`Error Deleting user no:${req.params.id} `);
                res.status(400).json({ "message": `Error Deleting user no:${req.params.id} ` });
            });
    },
    async addActivity(req, res) {
        infoLogger.info(`Add Activity to user ${req.params.id}`);
        if (req.params.id != req.userId) {
            if (req.userId) {
                isMod = await userService.isModerator(req.userId);
            }
            if (!isMod) {
                errorLogger.error(`unauthorized user ${req.userId}`);
                res.status(401).json({ "message": "Unauthorized user" });
                return;
            }
        }
        const { dateTime, recycleBinID, type, address } = req.body;
        if (dateTime && recycleBinID && type && address) {
            User.findOne({ _id: req.params.id })
                .then((user) => {
                    if (!user) {
                        errorLogger.error(`no user with id ${req.params.id}`);
                        res.status(400).json({ "message": `no user with id ${req.params.id}` });
                    }
                    else {
                        const activities = user.activities ?? [];
                        const newActivity = {
                            dateTime,
                            recycleBinID,
                            type,
                            address
                        };
                        let size = 0;
                        if (type === 'plastic') {
                            size = 10;
                            newActivity.points = 100;

                        } else if (type === 'glass') {
                            size = 20
                            newActivity.points = 150;

                        } else if (type === 'paper') {
                            size = 3;
                            newActivity.points = 50;

                        } else if (type === 'can') {
                            size = 5;
                            newActivity.points = 200;

                        } else if (type === 'other') {
                            size = 7;
                            newActivity.points = 50;

                        }
                        if (!recycleBinService.increaseCurrentCapacity(recycleBinID, size)) {
                            errorLogger.error("cannot throw into recycleBin");
                            res.status(406).json({ "message": "Cannot throw into recycleBin" });
                            return;
                        }
                        activities.push(newActivity);
                        User.updateOne({ _id: req.params.id }, { points: (user.points + newActivity.points), activities })
                            .then((result) => {
                                if (result.matchedCount > 0) {
                                    infoLogger.info(`Updating user's activities no:${req.params.id} is successfully`);
                                    res.json(newActivity);
                                }
                                else {
                                    errorLogger.error("Wrong user id please enter correct id");
                                    res.status(400).json({ "message": "Wrong user id please enter correct id" });
                                }
                            })
                            .catch((err) => res.status(400).json(err));
                    }
                })
                .catch(err => {
                    errorLogger.error(`Error Getting user from db:${err}`);
                    res.status(400).json({ "message": `Error Adding user ` });
                });
        } else {
            errorLogger.error("Missing Parameters Please send all Parameters ");
            res.status(400).json({ "message": "Missing Parameters Please send all Parameters" });
        }
    },
    async addCoupon(req, res) {
        infoLogger.info(`Add Coupon to user ${req.params.id}`);
        if (req.params.id != req.userId) {
            if (req.userId) {
                isMod = await userService.isModerator(req.userId);
            }
            if (!isMod) {
                errorLogger.error(`unauthorized user ${req.userId}`);
                res.status(401).json({ "message": "Unauthorized user" });
                return;
            }
        }
        const { couponId } = req.body;
        if (couponId) {
            User.findOne({ _id: req.params.id })
                .then((user) => {
                    if (!user) {
                        errorLogger.error(`no user with id ${req.params.id}`);
                        res.status(400).json({ "message": `no user with id ${req.params.id}` });
                    }
                    else {
                        const coupons = user.coupons ?? [];
                        couponService.getCoupon(couponId).then(newCoupon => {
                            if (!newCoupon) {
                                errorLogger.error(`Error adding coupon ${couponId} to user ${req.params.id}`);
                                res.status(400).json({ "message": "Error adding coupon" });
                                return;
                            }
                            if (newCoupon.cost > user.points) {
                                errorLogger.error(`User ${req.params.id} doesn't have enough points to buy coupon ${couponId}`);
                                res.status(400).json({ "message": "User doesn't have enough points to buy coupon" });
                                return;
                            }
                            coupons.push(newCoupon);
                            User.updateOne({ _id: req.params.id }, { points: (user.points - newCoupon.cost), coupons })
                                .then((result) => {
                                    if (result.matchedCount > 0) {
                                        infoLogger.info(`Updating user's coupons no:${req.params.id} is successfully`);

                                        res.status(200).json(newCoupon);
                                        return;
                                    }
                                    else {
                                        errorLogger.error("Wrong user id please enter correct id");
                                        res.status(400).json({ "message": "Wrong user id please enter correct id" });
                                    }
                                })
                                .catch((err) => res.status(400).json(err));
                        });
                    }
                })
                .catch(err => {
                    errorLogger.error(`Error Getting user from db:${err}`);
                    res.status(400).json({ "message": `Error Adding user ` });
                });
        } else {
            errorLogger.error("Missing Parameters Please send all Parameters ");
            res.status(400).json({ "message": "Missing Parameters Please send all Parameters" });
        }
    }
}
