const express = require('express');
const router = express.Router();
const database = require("../db/database");
const ObjectId = require('mongodb').ObjectId;

// Return a JSON object with list of all documents within the collection.
router.get('/documents', async function(req, res, next) {
    const db = await database.getDb();
    const result = await db.collection.find({}).toArray();
    console.log(result);
    const data = {
        data: {
            res: result
        }
    };
    res.json(data);

    await db.client.close();
});

// Create a new document.
// TODO get data from a React form.
router.post('/documents', async function(req, res, next) {
    const db = await database.getDb();
    const collection = db.collection;
    const doc = req.body;
    const result = await collection.insertOne(doc);
    res.json(result);
    await db.client.close();
});

router.post('/document/update', async function(req, res, next) {
    const db = await database.getDb();
    const collection = db.collection;
    const doc = req.body;
    console.log(doc);
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
// TODO get the ID from React.
router.get('/document/:id', async function(req, res) {
    const db = await database.getDb();
    const collection = db.collection;
    const doc = await collection.find({"_id" : new ObjectId(req.params.id)}).toArray()
    console.log(doc);
    res.json(doc);
    await db.client.close();
});

module.exports = router;