// // process.env.NODE_ENV = 'test';

// import * as chai from "chai";       // Import all named exports from chai
// import chaiHttp from "chai-http";    // Import chai-http as a default export
// import server from '../../app.js';     // Ensure this path is correct

// chai.use(chaiHttp);                  // Use chaiHttp as a plugin
// const should = chai.should();        // Use chai's should style assertion

import {use} from 'chai';
import chaiHttp from 'chai-http';
import server from '../../app.js';

const chai = use(chaiHttp);
chai.should();

describe('Documents', () => {
    describe('GET /documents', () => {
        it('Should have status 200', (done) => {
            chai.request.execute(server)
                .get("/documents")
                .end((err, res) => {
                    if (err) {
                        done(err); // Pass the error to done() if there is one
                    } else {
                        res.should.have.status(200);
                        res.body.should.be.an("object");
                        res.body.data.res.should.be.an("array");
                        res.body.data.res.length.should.be.above(0);
                        done(); // Finish the test
                        server.close();
                    }
                });
        });
    });
});

describe('Documents', () => {
    describe('GET /document/:id', () => {
        it('Should have status 200', (done) => {
            chai.request.execute(server)
                .get("/document/66e6fce08939d00d5d5d578d")
                .end((err, res) => {
                    if (err) {
                        done(err); // Pass the error to done() if there is one
                    } else {
                        res.should.have.status(200);
                        res.body.should.be.an("array");
                        res.body.length.should.be.above(0);
                        res.body[0]._id.should.be.a("string");
                        res.body[0].title.should.be.a("string");
                        res.body[0].content.should.be.a("string");
                        done(); // Finish the test
                        server.close();
                    }
                });
        });
    });
});
