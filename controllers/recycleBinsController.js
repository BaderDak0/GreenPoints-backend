const RecycleBin = require('../models/recycleBins');
const { infologger, errorlogger } = require("../logs/logs");
exports.RecycleBinsController = {
    getRecycleBins(req, res) {
        infologger.info("Get all RecycleBins");
        RecycleBin.find({})
            .then(recycleBin => {
                infologger.info("Success to Get all recycleBins");
                res.json(recycleBin)
            })
            .catch(err => {

                errorlogger.error(`Error getting the data from db:${err}`)
                res.json({ "message": `Error Gets recycleBins ` });

            });
    },
    getRecycleBinDetails(req, res) {
        infologger.info(`Get recycleBin id:${req.params.id}`);
        RecycleBin.findOne({ _id: req.params.id })
            .then((recycleBin) => {

                if (recycleBin) {
                    res.json(recycleBin)

                }
                else {
                    errorlogger.error("Wrong recycleBin id please enter correct id");
                    res.status(400).json({ "message": "Wrong recycleBin id please enter correct id" });
                }

            })
            .catch(err => {
                errorlogger.error(`Error Getting recycleBin from db:${err}`);
            });
    },
    editRecycleBinDetails(req, res) {
        infologger.info("Updating a recycleBin");
        RecycleBin.updateOne({ _id: req.params.id }, req.body)
            .then((result) => {

                if (result.matchedCount > 0) {
                    infologger.info(`Updating RecycleBin no:${req.params.id} is successfully`);
                    res.json({ "message": `Updating RecycleBin no:${req.params.id} is successfully` });
                }
                else {
                    errorlogger.error("Wrong RecycleBin id please enter correct id");
                    res.status(400).json({ "message": "Wrong RecycleBin id please enter correct id" });
                }
            })
            .catch((err) => res.status(400).json({ "message": "Wrong RecycleBin id please enter correct id" }));
    },
    addRecycleBin(req, res) {
        infologger.info("Add a recycleBin");
    
            const newRecycleBin = new RecycleBin(req.body);
            newRecycleBin.save()
                .then(result => {
                    infologger.info(`Adding RecycleBin in   :${req.body.location} is successfully`);
                    res.json(result);
                })
                .catch(err => {
                    errorlogger.error(`Error Adding RecycleBin `);
                    res.status(400).json({ "message": `Error Adding RecycleBin ` });
                });
    

    },
    deleteRecycleBin(req, res) {
        infologger.info("Delete a RecycleBin");
        RecycleBin.deleteOne({ _id: req.params.id })
            .then((result) => {
                if (result.deletedCount > 0) {
                    infologger.info(`Deleting RecycleBin no:${req.params.id} is successfully`);
                    res.json({ "message": `Deleting RecycleBin no:${req.params.id} is successfully` });
                }
                else {
                    errorlogger.error(`RecycleBin no:${req.params.id} does not exists`);
                    res.status(400).json({ "message": `RecycleBin no:${req.params.id} does not exists` });
                }

            })
            .catch(() => {
                errorlogger.error(`Error Deleting RecycleBin no:${req.params.id} `);
                res.status(400).json({ "message": `Error Deleting RecycleBin no:${req.params.id} ` });
            });
    }
}

