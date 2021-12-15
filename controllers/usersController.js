const User = require('../models/users');
const { infologger, errorlogger } = require("../logs/logs");
exports.UsersController = {
    getUsers(req, res) {
        infologger.info("Get all Users");
        User.find({})
            .then(user => {
                infologger.info("Success to Get all users");
                res.json(user)
            })
            .catch(err => {

                errorlogger.error(`Error getting the data from db:${err}`)
                res.json({ "message": `Error Gets users ` });

            });
    },
    getUserDetails(req, res) {
        infologger.info(`Get User id:${req.params.id}`);
        User.findOne({ _id: req.params.id })
            .then((user) => {

                if (user) {
                    res.json(user)

                }
                else {
                    errorlogger.error("Wrong user id please enter correct id");
                    res.status(400).json({ "message": "Wrong user id please enter correct id" });
                }

            })
            .catch(err => {
                errorlogger.error(`Error Getting user from db:${err}`);
            });
    },
    editUserDetails(req, res) {
        infologger.info("Updating a user");
        User.updateOne( { _id: req.params.id }, req.body )
                .then((result) => {

                    if (result.matchedCount > 0) {
                        infologger.info(`Updating user no:${req.params.id} is successfully`);
                        res.json({ "message": `Updating user no:${req.params.id} is successfully` });
                    }
                    else {
                        errorlogger.error("Wrong user id please enter correct id");
                        res.status(400).json({ "message": "Wrong user id please enter correct id" });
                    }
                })
                .catch((err) => res.status(400).json(err));
    },
    addUser(req, res) {
        infologger.info("Add a user");
        if (req.body.name && req.body.email && req.body.password && req.body.registerDate && req.body.score,req.body.moderator) {
            const newUser = new User(req.body);
            const result = newUser.save()
            if (result) {
                infologger.info(`Adding user  :${req.body.name} is successfully`);
                res.json({ "message": `Adding user  :${req.body.name} is successfully` });
            }
            else {
                errorlogger.error(`Error Adding user `);
                res.json({ "message": `Error Adding user ` });
            }
        }
        else {
            errorlogger.error("Missing Parameters Please send all Parameters ");
            res.status(400).json({ "message": "Missing Parameters Please send all Parameters" });
        }
    },
    deleteUser(req, res) {
        infologger.info("Delete a user");
        User.deleteOne({ id: req.params.id })
            .then((result) => {
                if (result.deletedCount > 0) {
                    infologger.info(`Deleting user no:${req.params.id} is successfully`);
                    res.json({ "message": `Deleting user no:${req.params.id} is successfully` });
                }
                else {
                    errorlogger.error(`user no:${req.params.id} does not exists`);
                    res.status(400).json({ "message": `user no:${req.params.id} does not exists` });
                }

            })
            .catch(() => {
                errorlogger.error(`Error Deleting user no:${req.params.id} `);
                res.status(400).json({ "message": `Error Deleting user no:${req.params.id} ` });
            });
    }
}
