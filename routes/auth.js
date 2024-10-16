const express = require('express');
const router = express.Router();
const database = require("../db/database");
const bcrypt = require('bcryptjs');
const collectionName = "users";

router.post('/register', async (req, res) => {
    const db = await database.getDb(collectionName);
    const collection = db.collection;
    const saltRounds = 10;
    const username = req.body.username;
    const password = JSON.stringify(req.body.password);
    const email = req.body.email;

    bcrypt.hash(password, saltRounds, async function(err, hash) {
        const user = {
            "username": username,
            "email": email,
            "password": hash
        }
        const result = await collection.insertOne(user);

        res.json(result);

        await db.client.close();
    });
});

module.exports = router;