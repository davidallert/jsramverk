const assert = require('assert');
const server = require('../app.js');
const request = require('supertest');

describe("GET /documents", () => {
    describe("Get all documents", () => {
        it("Should be array", async () => {
            const res = await request(server).get('/documents');
            assert.equal(Array.isArray(res.body.data.res), true);
            server.close();
        });
    });
});