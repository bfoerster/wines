process.env.NODE_ENV = 'test';

const Wine = require('../models/wine');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.should();
chai.use(chaiHttp);

describe('Testing Wines API', () => {
    beforeEach((done) => {
        Wine.remove({}, () => {
            done();
        });
    });

    it('Test POST wine', (done) => {
        const wine = new Wine({
            name: 'Cabernet sauvignon',
            year: 2013,
            country: 'France',
            type: 'red',
            description: 'The Sean Connery of red wines'
        });

        chai.request(app)
            .post('/wines')
            .send(wine)
            .end((error, response) => {
                response.should.have.status(201);
                response.body.name.should.be.eql(wine.name);
                response.body.year.should.be.eql(wine.year);
                response.body.country.should.be.eql(wine.country);
                response.body.type.should.be.eql(wine.type);
                response.body.description.should.be.eql(wine.description);
                response.body._id.should.exist;

                Wine.findOne({'_id': response.body._id}).then((result) => {
                    result.name.should.be.eql(wine.name);
                    result.year.should.be.eql(wine.year);
                    result.country.should.be.eql(wine.country);
                    result.type.should.be.eql(wine.type);
                    result.description.should.be.eql(wine.description);
                    done();
                });
            });
    });

    it('Test POST wine with missing fields', (done) => {
        const wine = new Wine({});

        chai.request(app)
            .post('/wines')
            .send(wine)
            .end((error, response) => {

                response.should.have.status(400);
                response.body.error.should.be.eql('VALIDATION_ERROR');
                response.body.validation.name.should.be.eql('MISSING');
                response.body.validation.year.should.be.eql('MISSING');
                response.body.validation.country.should.be.eql('MISSING');
                response.body.validation.type.should.be.eql('MISSING');

                Wine.find().then((result) => {
                    result.length.should.be.eql(0);
                    done();
                });
            });
    });

    it('Test POST wine with invalid type', (done) => {
        const wine = new Wine({
            name: 'Cabernet sauvignon',
            year: 2013,
            country: 'France',
            type: 'invalid',
            description: 'The Sean Connery of red wines'
        });

        chai.request(app)
            .post('/wines')
            .send(wine)
            .end((error, response) => {

                response.should.have.status(400);
                response.body.error.should.be.eql('VALIDATION_ERROR');
                response.body.validation.type.should.be.eql('INVALID');

                Wine.find().then((result) => {
                    result.length.should.be.eql(0);
                    done();
                });
            });
    });


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
