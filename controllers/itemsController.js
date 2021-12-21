const Item = require('../models/items');
const { infologger, errorlogger } = require("../logs/logs");
exports.ItemsController = {
    getItems(req, res) {
        infologger.info("Get all Items");
        Item.find({})
            .then(item => {
                infologger.info("Success to Get all Items");
                res.json(item)
            })
            .catch(err => {
                errorlogger.error(`Error getting the data from db:${err}`)
                res.status(500).json({ "message": `Error Gets item` });
            });
    },
    getItemDetails(req, res) {
        infologger.info(`Get item id:${req.params.id}`);
        Item.findOne({ _id: req.params.id })
            .then((item) => {
                if (item) {
                    res.json(item)
                }
                else {
                    errorlogger.error("Wrong item id please enter correct id");
                    res.status(400).json({ "message": "Wrong item id please enter correct id" });
                }
            })
            .catch(err => {
                errorlogger.error(`Error Getting item from db:${err}`);
                res.status(500).json({ "message": `Error getting item` });
            });
    },
    editItemDetails(req, res) {
        infologger.info("Updating a item");
        Item.updateOne({ _id: req.params.id }, req.body)
            .then((result) => {
                if (result.matchedCount > 0) {
                    infologger.info(`Updating item no:${req.params.id} is successfully`);
                    res.json({ "message": `Updating item no:${req.params.id} is successfully` });
                }
                else {
                    errorlogger.error("Wrong item id please enter correct id");
                    res.status(400).json({ "message": "Wrong item id please enter correct id" });
                }
            })
            .catch((err) => res.status(400).json(err));
    },
    addItem(req, res) {
        infologger.info("Add a item");
        if (req.body.type && req.body.size) {
            const newItem = new Item(req.body);
            newItem.save()
                .then(result => {
                    infologger.info(`Adding newItem type   :${req.body.newItem} is successfully`);
                    res.json(result);
                })
                .catch(err => {
                    errorlogger.error(`Error Adding newItem `);
                    res.status(400).json({ "message": `Error Adding newItem ` });
                });
        }
        else {
            errorlogger.error("Missing Parameters Please send all Parameters ");
            res.status(400).json({ "message": "Missing Parameters Please send all Parameters" });
        }
    },
    deleteItem(req, res) {
        infologger.info("Delete a Item");
        Item.deleteOne({ _id: req.params.id })
            .then((result) => {
                if (result.deletedCount > 0) {
                    infologger.info(`Deleting Item no:${req.params.id} is successfully`);
                    res.json({ "message": `Deleting Item no:${req.params.id} is successfully` });
                }
                else {
                    errorlogger.error(`Item no:${req.params.id} does not exists`);
                    res.status(400).json({ "message": `Item no:${req.params.id} does not exists` });
                }

            })
            .catch(() => {
                errorlogger.error(`Error Deleting Item no:${req.params.id} `);
                res.status(400).json({ "message": `Error Deleting Item no:${req.params.id} ` });
            });
    }
}
