const User = require('../models/users');
const { infoLogger, errorLogger } = require("../logs/logs");
let bcrypt = require('bcryptjs');

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
    editUserDetails(req, res) {
        infoLogger.info("Updating a user");
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
    deleteUser(req, res) {
        infoLogger.info("Delete a user");
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
    addActivity(req, res) {
        infoLogger.info(`Add Activity to user ${req.params.id}`);
        const { dateTime, recycleBinID, type, address } = req.body;
        if (dateTime && recycleBinID && type && address) {
            User.findOne({ _id: req.params.id })
                .then((user) => {
                    if (!user) {
                        errorLogger.error(`no user with id ${req.params.id}`);
                        res.status(400).json({ "message": `no user with id ${req.params.id}` });
                    }
                    else {
                        const activites = user.activites ?? [];
                        const newActivity = {
                            dateTime,
                            recycleBinID,
                            type,
                            address
                        };
                        if (type === 'plastic') {
                            newActivity.points = 100;
                        } else if (type === 'glass') {
                            newActivity.points = 150;
                        } else if (type === 'paper') {
                            newActivity.points = 50;
                        } else if (type === 'can') {
                            newActivity.points = 200;
                        } else if (type === 'other') {
                            newActivity.points = 50;
                        }
                        activites.push(newActivity);
                        User.updateOne({ _id: req.params.id }, { points: user.points + newActivity.points, activites })
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
    }
}
