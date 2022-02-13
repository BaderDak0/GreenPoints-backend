const constants = require('../constants');
const { SECRET } = constants;
const User = require('../models/users');
const { infoLogger, errorLogger } = require("../logs/logs");
let bcrypt = require('bcryptjs');
let jwt = require("jsonwebtoken");

exports.authController = {
    signup(req, res) {
        infoLogger.info("user signup");
        const { name, email, age, gender, password, imgUrl } = req.body;
        if (name, email, age, gender, password, imgUrl) {
            User.findOne({ email: email })
                .then((user) => {
                    if (user) {
                        errorLogger.error("this email is already exists");
                        res.status(400).json({ "message": "this email is already exists" });
                    }
                    else {
                        const newUser = new User({
                            name,
                            email,
                            age,
                            gender,
                            imgUrl,
                            password: bcrypt.hashSync(req.body.password, 8),
                            registerDate: new Date().toLocaleString(),
                            points: 0,
                            moderator: false,
                            activities: [],
                        });
                        newUser.save()
                            .then(result => {
                                infoLogger.info(`Adding user  :${req.body.name} is successfully`);
                                res.json(result);
                            })
                            .catch(err => {
                                errorLogger.error(`Error Adding user `);
                                res.status(400).json({ "message": `Error Adding user ` });
                            });
                    }
                })
                .catch(err => {
                    errorLogger.error(`Error Getting user from db:${err}`);
                    res.status(400).json({ "message": `Error Adding user ` });
                });
        }
        else {
            errorLogger.error("Missing Parameters Please send all Parameters ");
            res.status(400).json({ "message": "Missing Parameters Please send all Parameters" });
        }
    },
    async login (req, res) {
        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) {
                errorLogger.error("Wrong user email please enter correct email");
                res.status(400).json({ "message": "Wrong user email please enter correct email" });
            }
            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(401).json({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }
            const token = jwt.sign({ id: user._id }, SECRET, {
                expiresIn: 86400 // 24 hours
            });
            res.status(200).json({
                id: user._id,
                name: user.name,
                email: user.email,
                moderator: user.moderator,
                age: user.age,
                gender: user.gender,
                registerDate: user.registerDate,
                points: user.points,
                activities: user.activities,
                accessToken: token
            });
        }
        catch (err) {
            errorLogger.error(`Error Getting user from db:${err}`);
            res.status(500).json({ "message": `Error getting user ` });
        }


    }
};