const express = require('express');
const router = express.Router();
const database = require("../db/database");
const ObjectId = require('mongodb').ObjectId;
const collectionName = "documents";
const jwt = require('jsonwebtoken');

// Return a JSON object with list of all documents within the collection.
router.get('/documents',
    (req, res, next) => checkToken(req, res, next),
    async function(req, res, next) {
    const db = await database.getDb(collectionName);

    let decodedToken;

    // FIX Should probably use the checkToken function for this, but I can't get it to work.
    jwt.verify(req.headers['x-access-token'], process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            console.error(err)
        } else {
            decodedToken = decoded
        }
    });
    const email = decodedToken.user[0].email;

    const result = await db.collection.find({ owner: email }).toArray();
    // console.log(result);
    const data = {
        data: {
            res: result
        }
    };
    res.json(data);

    await db.client.close();
});

// Create a new document.
router.post('/documents',
    (req, res, next) => checkToken(req, res, next),
    async function(req, res, next) {
    const db = await database.getDb(collectionName);
    const collection = db.collection;
    let doc = req.body;
    let decodedToken;

    // FIX Should probably use the checkToken function for this, but I can't get it to work.
    jwt.verify(req.headers['x-access-token'], process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            console.error(err)
        } else {
            decodedToken = decoded
        }
    });

    const email = decodedToken.user[0].email;

    doc.owner = email;

    const result = await collection.insertOne(doc);

    res.json(result);
    await db.client.close();
});

// Update an existing document.
router.post('/document/update', async function(req, res, next) {
    const db = await database.getDb(collectionName);
    const collection = db.collection;
    const doc = req.body;
    // console.log(doc);
    const result = await collection.updateOne(
        { _id: new ObjectId(doc.id) },
        { $set: {
            title: doc.title,
            content: doc.content,
          },
        },
    );
    res.json(result);
    await db.client.close();
});


// Get a document via its ID.
router.get('/document/:id', async function(req, res) {
    const db = await database.getDb(collectionName);
    const collection = db.collection;
    const doc = await collection.find({"_id" : new ObjectId(req.params.id)}).toArray()
    // console.log(doc);
    res.json(doc);
    await db.client.close();
});

// Delete a document with ID.
// router.delete('/document', async function(req, res) {
//     const db = await database.getDb();
//     const collection = db.collection;
//     await collection.deleteOne({ "_id" : 1 })
//     // console.log(doc);
//     // res.json(doc);
//     await db.client.close();
// });

function checkToken(req, res, next) {
    const token = req.headers['x-access-token'];
    console.log('-------------------------------------------------------------------------------');
    console.log('This is documents.js (backend). JSON WEB TOKEN:', (token || "No token provided."));
    console.log('-------------------------------------------------------------------------------');
    // if (token) {
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
                console.error(err)
                res.send(err)
                // Send error response
            } else {
                // Valid token send on the request
                // res.send(decoded)
                next();
            }
        });
    // }
}

// function decodeToken(req, res, next) {
//     jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
//         if (err) {
//             console.error(err)
//         } else {
//             return decoded
//         }
//     });
// }

module.exports = router;