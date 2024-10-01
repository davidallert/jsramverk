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

// process.env.NODE_ENV = "test"

describe('Documents', () => {

    beforeEach((done) => {
        console.log('Starting test..............................................................');
        done();
    });

    afterEach((done) => {
        console.log('Finishing test.............................................................');
        done();
    });

    // after( async () => {
    //     try {
    //         const response = await fetch(`https://jsramverk-editor-daae23-cucfhygme0ete5ea.swedencentral-01.azurewebsites.net/document`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to delete data.')
    //         }

    //         return response;
    //     } catch (error) {
    //         console.error(error);
    //     }
    // });

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
                        res.body[0]._id.should.equal("66e6fce08939d00d5d5d578d");
                        done(); // Finish the test
                        server.close();
                    }
                });
        });
    });

    describe('POST to /documents', () => {
        it('Should have status 200', (done) => {
            const doc = {title: 'Title test', content: 'Content test'}
            chai.request.execute(server)
                .post("/documents")
                .type('application/json')
                .send(doc)
                .end((err, res) => {
                    if (err) {
                        done(err); // Pass the error to done() if there is one
                    } else {
                        res.should.have.status(200);
                        done(); // Finish the test
                        server.close();
                    }
                });
        });
    });

    describe('POST to /document/update', () => {
        it('Should have status 200', (done) => {
            const doc = {id: '66e6fce08939d00d5d5d578d', title: 'Document 1 (test)', content: 'This is the first document (test).'}
            chai.request.execute(server)
                .post("/document/update")
                .type('application/json')
                .send(doc)
                .end((err, res) => {
                    if (err) {
                        done(err); // Pass the error to done() if there is one
                    } else {
                        res.should.have.status(200);
                        done(); // Finish the test
                        server.close();
                    }
                });
        });
    });

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
                        res.body[0]._id.should.equal("66e6fce08939d00d5d5d578d");
                        res.body[0].title.should.equal("Document 1 (test)");
                        res.body[0].content.should.equal("This is the first document (test).");
                        done(); // Finish the test
                        server.close();
                    }
                });
        });
    });

    describe('POST to /document/update', () => {
        it('Should have status 200', (done) => {
            const doc = {id: '66e6fce08939d00d5d5d578d', title: 'Document 1', content: 'This is the first document.'}
            chai.request.execute(server)
                .post("/document/update")
                .type('application/json')
                .send(doc)
                .end((err, res) => {
                    if (err) {
                        done(err); // Pass the error to done() if there is one
                    } else {
                        res.should.have.status(200);
                        done(); // Finish the test
                        server.close();
                    }
                });
        });
    });
});


