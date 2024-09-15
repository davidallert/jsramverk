const express = require('express');
const router = express.Router();
const database = require("../db/database");
const ObjectId = require('mongodb').ObjectId;

// Return a JSON object with list of all documents within the collection.
router.get('/documents', async function(req, res, next) {
    const db = await database.getDb();
    const resultSet = await db.collection.find({}).toArray();
    console.log(resultSet);
    const data = {
        data: {
            res: resultSet
        }
    };
    res.json(data);

    await db.client.close();
});

// Create a new document.
// TODO get data from a React form.
router.post('/documents', async function(req, res, next) {
    const db = await database.getDb();
    const doc = { title: "Document 4", content: "Doc 4." } // FIX insert variables here.
    const collection = db.collection;
    const result = await collection.insertOne(doc);
    console.log(result);
    res.json(result)
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

// router.put('/document/:id', async (req, res) => {
//     const db = await database.getDb();
//     const collection = await database.collection;
//     const result = await collection.updateOne()
// })

module.exports = router;