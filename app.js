/**
 * Connect to the database and search using a criteria.
 */
"use strict";

const database = require("./db/database");
const cors = require('cors');
const index = require('./routes/index');

// MongoDB
// const mongo = require("mongodb").MongoClient;
const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/mumin";

// Express server
const port = process.env.DBWEBB_PORT || 1337;
const express = require("express");
const app = express();

app.use(cors());
app.use('/', index);

// This is middleware called for all routes.
// Middleware takes three parameters.
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

// Just for testing the sever
// app.get("/", (req, res) => {
//     res.send("Hello World");
// });

// Return a JSON object with list of all documents within the collection.
app.get("/list", async (request, response) => {
    const db = await database.getDb();
    const resultSet = await db.collection.find({}).toArray();
    console.log(resultSet);
    response.json(resultSet);

    await db.client.close();

});

// Startup server and liten on port
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
    console.log(`DSN is: ${dsn}`);
});

// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});