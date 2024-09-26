/**
 * Connect to the database and search using a criteria.
 */
"use strict";

const database = require("./db/database");
const cors = require('cors');
const index = require('./routes/index');
const documents = require('./routes/documents');

// Express server
const port = process.env.DBWEBB_PORT || process.env.PORT || 1337;
const express = require("express");
const app = express();

// const allowedOrigins = {
//     origin: ['http://localhost:3000', 'https://www.student.bth.se/~daae23/editor/'],
//     methods: ['GET', 'POST'],
//     credentials: true,
//     allowedHeaders: ['Content-Type'],
// }

app.use(cors());
app.use('/', index);
app.use('/', documents);

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

// Startup server and liten on port
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
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