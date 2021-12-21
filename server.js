const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const { ItemsRouter } = require("./routers/itemsRouter");
const { RecycleBinsRouter } = require("./routers/recycleBinsRouter");
const { UsersRouter } = require("./routers/usersRouter");
const { infologger, errorlogger } = require("./logs/logs");
const corsConfig = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    next()
}
app.use(corsConfig);
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true ,limit: '50mb'}));
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