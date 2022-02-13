const RecycleBin = require('../models/recycleBins');
const { infoLogger, errorLogger } = require("../logs/logs");
exports.recycleBinsController = {
    getRecycleBins(req, res) {
        infoLogger.info("Get all RecycleBins");
        RecycleBin.find({})
            .then(recycleBin => {
                infoLogger.info("Success to Get all recycleBins");
                res.json(recycleBin)
            })
            .catch(err => {
                errorLogger.error(`Error getting the data from db:${err}`)
                res.status(500).json({ "message": `Error Gets recycleBins ` });
            });
    },
    getRecycleBinDetails(req, res) {
        infoLogger.info(`Get recycleBin id:${req.params.id}`);
        RecycleBin.findOne({ _id: req.params.id })
            .then((recycleBin) => {
                if (recycleBin) {
                    res.json(recycleBin)
                }
                else {
                    errorLogger.error("Wrong recycleBin id please enter correct id");
                    res.status(400).json({ "message": "Wrong recycleBin id please enter correct id" });
                }
            })
            .catch(err => {
                errorLogger.error(`Error Getting recycleBin from db:${err}`);
                res.status(500).json({ "message": `Error getting recycle bin` });
            });
    },
    editRecycleBinDetails(req, res) {
        infoLogger.info("Updating a recycleBin");
        RecycleBin.updateOne({ _id: req.params.id }, req.body)
            .then((result) => {
                if (result.matchedCount > 0) {
                    infoLogger.info(`Updating RecycleBin no:${req.params.id} is successfully`);
                    res.json({ "message": `Updating RecycleBin no:${req.params.id} is successfully` });
                }
                else {
                    errorLogger.error("Wrong RecycleBin id please enter correct id");
                    res.status(400).json({ "message": "Wrong RecycleBin id please enter correct id" });
                }
            })
            .catch((err) => res.status(400).json({ "message": "Wrong RecycleBin id please enter correct id" }));
    },
    addRecycleBin(req, res) {
        infoLogger.info("Add a recycleBin");
        const newRecycleBin = new RecycleBin(req.body);
        newRecycleBin.save()
            .then(result => {
                infoLogger.info(`Adding RecycleBin in   :${req.body.location} is successfully`);
                res.json(result);
            })
            .catch(err => {
                errorLogger.error(`Error Adding RecycleBin `);
                res.status(400).json({ "message": `Error Adding RecycleBin ` });
            });
    },
    deleteRecycleBin(req, res) {
        infoLogger.info("Delete a RecycleBin");
        RecycleBin.deleteOne({ _id: req.params.id })
            .then((result) => {
                if (result.deletedCount > 0) {
                    infoLogger.info(`Deleting RecycleBin no:${req.params.id} is successfully`);
                    res.json({ "message": `Deleting RecycleBin no:${req.params.id} is successfully` });
                }
                else {
                    errorLogger.error(`RecycleBin no:${req.params.id} does not exists`);
                    res.status(400).json({ "message": `RecycleBin no:${req.params.id} does not exists` });
                }
            })
            .catch(() => {
                errorLogger.error(`Error Deleting RecycleBin no:${req.params.id} `);
                res.status(400).json({ "message": `Error Deleting RecycleBin no:${req.params.id} ` });
            });
    }
}

