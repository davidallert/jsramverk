import 'dotenv/config'

const port = process.env.PORT;

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

import documents from "./docs.mjs";

const app = express();

app.disable('x-powered-by');

app.set("view engine", "ejs");

app.use(express.static(path.join(process.cwd(), "public")));

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    return res.render("index", { docs: await documents.getAll() });
});

app.get('/create', async (req, res) => {
    return res.render("doc_create.ejs", { docs: await documents.getAll() });
});

app.post("/create", async (req, res) => {
    const result = await documents.addOne(req.body);

    return res.redirect(`/`);
});

app.post("/update", async (req, res) => {
    await documents.updateOne(req.body);
    return res.redirect(`/update/${req.body.id}`);
});

app.get('/update/:id', async (req, res) => {
    let rowid = req.params.id;
    return res.render(
        "doc",
        { doc: await documents.getOne(req.params.id), rowid }
    );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});