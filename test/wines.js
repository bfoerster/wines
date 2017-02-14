process.env.NODE_ENV = 'test';

const Wine = require('../models/wine');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);

describe('Testing Wines API', () => {
    describe('Removing all wine objects from database', () => {
        beforeEach((done) => {
            Wine.remove({}, () => {
                done();
            });
        });
    });

    describe('Testing the wines GET method', () => {
        it('GET all wines with non available', (done) => {
            chai.request(app)
                .get('/wines')
                .end((error, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    response.body.length.should.be.eql(0);
                    done();
                });
        });
    });
});
