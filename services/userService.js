const User = require('../models/users');
const { infoLogger, errorLogger } = require("../logs/logs");

exports.userService = {
    async isModerator(userId) {
        let user;
        try {
            user = await User.findOne({ _id: userId });
        } catch (err) {
            return false;
        }
        if (!user || !user.moderator) {
            return false;
        }
        return true;
    }
};