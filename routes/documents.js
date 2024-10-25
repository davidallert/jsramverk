const express = require('express');
const router = express.Router();
const database = require("../db/database");
const ObjectId = require('mongodb').ObjectId;
const collectionName = "documents";
const jwt = require('jsonwebtoken');
const Recipient = require('mailersend').Recipient;
const EmailParams = require('mailersend').EmailParams;
const MailerSend = require('mailersend').MailerSend;
const Sender = require('mailersend').Sender;

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

    const result = await db.collection.find({
        $or: [
            { owner: email },
            { invited: email }
          ]
     }).toArray();
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
    doc.invited = [];
    doc.comments = [];

    const result = await collection.insertOne(doc);

    res.json(result);
    await db.client.close();
});

router.post('/invite',
    (req, res, next) => checkToken(req, res, next),
    async (req, res, next) => {
        const sendFromEmail = "jsramverk@trial-k68zxl2yxn34j905.mlsender.net";
        const sendToEmail = req.body.email;
        const id = req.body.id;
        const mailerSendConfig = {apiKey: process.env.MAILERSEND_API_KEY}
        const mailerSend = new MailerSend(mailerSendConfig);
        const recipients = [new Recipient(sendToEmail, sendToEmail)];
        const sentFrom = new Sender(sendFromEmail, "MailerSend");

        const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setSubject(`You've been invited to document ${id}`)
        .setHtml(`
            <a href="https://jsramverk-editor-daae23-cucfhygme0ete5ea.swedencentral-01.azurewebsites.net/invite?id=${id}&email=${sendToEmail}">Click here</a> to edit the document.
            <br><br>
            <a href="https://www.nationalgeographic.com/animals/mammals/facts/domestic-cat">Click here too.</a>`
        );

        try {
            await mailerSend.email.send(emailParams)
            res.send(emailParams);
            console.log(emailParams);
        } catch (error) {
            console.log(error)
        }
});

router.get('/invite', async (req, res, next) => {
    const id = req.query.id
    const email = req.query.email

    const db = await database.getDb(collectionName);
    const collection = db.collection;
    const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $addToSet: { invited: email } },
    );
    console.log(result);
    await db.client.close();
    res.redirect('https://www.student.bth.se/~daae23/editor/#/login');
});

router.post('/comment', async (req, res, next) => {
    const id = req.body.id;
    const text = req.body.text;
    const comment = req.body.comment;

    const db = await database.getDb(collectionName);
    const collection = db.collection;
    const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        {
            $push: {
                comments: {
                    text: text,
                    comment: comment,
                    createdAt: new Date(),
                }
            }
        }
    );
    console.log(result);
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