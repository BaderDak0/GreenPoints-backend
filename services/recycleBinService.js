const RecycleBin = require('../models/recycleBins');
const { infoLogger, errorLogger } = require("../logs/logs");

exports.recycleBinService = {
    async increaseCurrentCapacity(binId, size) {
        infoLogger.info(`Get recycleBin id:${binId}`);
        let recycleBin;
        let currentCapacity;
        let result;
        try {
            recycleBin = await RecycleBin.findOne({ _id: binId });
            if (!recycleBin) {
                errorLogger.error("Wrong recycleBin id please enter correct id");
                return false;
            }
        }
        catch (err) {
            errorLogger.error(`Error Getting recycleBin from db:${err}`);
            res.status(500).json({ "message": `Error getting recycle bin` });
        }
        currentCapacity = recycleBin.currentCapacity;
        currentCapacity = currentCapacity + size;
        if (currentCapacity > recycleBin.maxCapacity) {
            return false;
        }
        infoLogger.info("Increase current capacity a recycleBin");
        try {
            result = await RecycleBin.updateOne({ _id: binId }, { currentCapacity: currentCapacity })
            if (result.matchedCount > 0) {
                infoLogger.info(`Updating RecycleBin no:${binId} is successfully`);
                return true;
            }
            else {
                errorLogger.error("Wrong RecycleBin id please enter correct id");
                return false;
            }

        }
        catch (err) {
            return false;
        }
    },
}
