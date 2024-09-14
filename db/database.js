const mongo = require("mongodb").MongoClient;
// const config = require("./config.json");
const collectionName = "crowd";
const morgan = require('morgan');

const database = {
    getDb: async function getDb () {
        let dsn = `mongodb://localhost:27017/mumin`;

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
            // use morgan to log at command line
            app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
        }

        const client  = await mongo.connect(dsn);
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;