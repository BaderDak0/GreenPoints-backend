const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const { ItemsRouter } = require("./routers/itemsRouter");
const { RecycleBinsRouter } = require("./routers/recycleBinsRouter");
const { UsersRouter } = require("./routers/usersRouter");
const { infologger, errorlogger } = require("./logs/logs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', UsersRouter);
app.use('/api/recycleBins', RecycleBinsRouter);
app.use('/api/items', ItemsRouter);

app.use((req, res) => {
    errorlogger.error(`Bad Methode Request!:${req.method} ${req.url}`);
    res.status(400).send('Bad Methode Request!');
});
app.listen(port, () => {
    infologger.info(`Express server is running on port ${port}`);
});