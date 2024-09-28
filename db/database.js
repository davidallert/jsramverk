// sudo service mongod start
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

const mongo = require("mongodb").MongoClient;
// const config = require("./config.json");
const collectionName = "documents";
const morgan = require('morgan');

const database = {
    getDb: async function getDb () {
        // let dsn = `mongodb://localhost:27017/docs`;
        let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster.fatuf.mongodb.net/docs?retryWrites=true&w=majority&appName=Cluster`

        // console.log(dsn);

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
            // use morgan to log at command line
            app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
        }

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;