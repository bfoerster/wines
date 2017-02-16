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

    it('GET all wines with wines available', (done) => {

        const first = new Wine({
            name: 'Pinot noir',
            year: 2011,
            country: 'France',
            type: 'red',
            description: 'Sensual and understated'
        });

        const second = new Wine({
            name: 'Zinfandel',
            year: 1990,
            country: 'Croatia',
            type: 'red',
            description: 'Thick and jammy'
        });

        first.save().then(() => {
            second.save().then(() => {
                chai.request(app)
                    .get('/wines')
                    .end((error, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('array');
                        response.body.length.should.be.eql(2);
                        done();
                    });
            });
        });
    });

    it('GET all wines and search by year', (done) => {

        const first = new Wine({
            name: 'Pinot noir',
            year: 2011,
            country: 'France',
            type: 'red',
            description: 'Sensual and understated'
        });

        const second = new Wine({
            name: 'Zinfandel',
            year: 1990,
            country: 'Croatia',
            type: 'red',
            description: 'Thick and jammy'
        });

        first.save().then(() => {
            second.save().then(() => {
                chai.request(app)
                    .get('/wines?year=1990')
                    .end((error, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('array');
                        response.body.length.should.be.eql(1);
                        response.body[0].name.should.be.eql(second.name);
                        response.body[0].year.should.be.eql(second.year);
                        done();
                    });
            });
        });
    });

    it('GET all wines and search by name', (done) => {

        const first = new Wine({
            name: 'Pinot noir',
            year: 2011,
            country: 'France',
            type: 'red',
            description: 'Sensual and understated'
        });

        const second = new Wine({
            name: 'Zinfandel',
            year: 1990,
            country: 'Croatia',
            type: 'red',
            description: 'Thick and jammy'
        });

        first.save().then(() => {
            second.save().then(() => {
                chai.request(app)
                    .get('/wines?name=' + second.name)
                    .end((error, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('array');
                        response.body.length.should.be.eql(1);
                        response.body[0].name.should.be.eql(second.name);
                        response.body[0].year.should.be.eql(second.year);
                        done();
                    });
            });
        });
    });

    it('GET all wines and search by type', (done) => {

        const first = new Wine({
            name: 'Pinot noir',
            year: 2011,
            country: 'France',
            type: 'red',
            description: 'Sensual and understated'
        });

        const second = new Wine({
            name: 'Zinfandel',
            year: 1990,
            country: 'Croatia',
            type: 'white',
            description: 'Thick and jammy'
        });

        first.save().then(() => {
            second.save().then(() => {
                chai.request(app)
                    .get('/wines?type=' + second.type)
                    .end((error, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('array');
                        response.body.length.should.be.eql(1);
                        response.body[0].name.should.be.eql(second.name);
                        response.body[0].type.should.be.eql(second.type);
                        done();
                    });
            });
        });
    });

    it('GET all wines and search by country', (done) => {

        const first = new Wine({
            name: 'Pinot noir',
            year: 2011,
            country: 'France',
            type: 'red',
            description: 'Sensual and understated'
        });

        const second = new Wine({
            name: 'Zinfandel',
            year: 1990,
            country: 'Croatia',
            type: 'white',
            description: 'Thick and jammy'
        });

        first.save().then(() => {
            second.save().then(() => {
                chai.request(app)
                    .get('/wines?country=' + second.country)
                    .end((error, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('array');
                        response.body.length.should.be.eql(1);
                        response.body[0].name.should.be.eql(second.name);
                        response.body[0].country.should.be.eql(second.country);
                        done();
                    });
            });
        });
    });

    it('PUT update wine object', (done) => {

        const wine = new Wine({
            name: 'Pinot noir',
            year: 2011,
            country: 'France',
            type: 'red',
            description: 'Sensual and understated'
        });

        const changedName = 'Another name';

        wine.save().then((saved) => {
            chai.request(app)
                .put('/wines/' + saved._id)
                .send({name: changedName})
                .end((error, response) => {
                    response.should.have.status(200);
                    response.body.name.should.be.eql(changedName);

                    Wine.findOne({'_id': wine._id}).then((result) => {
                        result.name.should.be.eql(changedName);
                        result.year.should.be.eql(wine.year);
                        result.country.should.be.eql(wine.country);
                        result.type.should.be.eql(wine.type);
                        result.description.should.be.eql(wine.description);
                        done();
                    });
                });
        });
    });

    it('PUT update wine object with unknown id', (done) => {

        chai.request(app)
            .put('/wines/58a5fbdabea9e2076eef8c54')
            .send({name: 'Another name'})
            .end((error, response) => {
                response.should.have.status(400);
                response.body.error.should.be.eql('UNKNOWN_OBJECT');

                Wine.find().then((result) => {
                    result.length.should.be.eql(0);
                    done();
                });
            });
    });

    it('DELETE wine object', (done) => {

        const wine = new Wine({
            name: 'Pinot noir',
            year: 2011,
            country: 'France',
            type: 'red',
            description: 'Sensual and understated'
        });

        wine.save().then((saved) => {
            chai.request(app)
                .delete('/wines/' + saved._id)
                .end((error, response) => {
                    response.should.have.status(200);
                    response.body.success.should.be.true;

                    Wine.find().then((result) => {
                        result.length.should.be.eql(0);
                        done();
                    });
                });
        });
    });

    it('DELETE wine object with unknown id', (done) => {

        chai.request(app)
            .delete('/wines/58a5fbdabea9e2076eef8c54')
            .end((error, response) => {
                response.should.have.status(400);
                response.body.error.should.be.eql('UNKNOWN_OBJECT');
                done();
            });
    });

    it('GET all wines and search by name', (done) => {

        const wine = new Wine({
            name: 'Pinot noir',
            year: 2011,
            country: 'France',
            type: 'red',
            description: 'Sensual and understated'
        });

        wine.save().then((saved) => {
            chai.request(app)
                .get('/wines/' + saved._id)
                .end((error, response) => {
                    response.should.have.status(200);
                    response.body.name.should.be.eql(wine.name);
                    response.body.year.should.be.eql(wine.year);
                    response.body.country.should.be.eql(wine.country);
                    response.body.type.should.be.eql(wine.type);
                    response.body.description.should.be.eql(wine.description);
                    done();
                });
        });
    });

    it('GET all wines and search by name', (done) => {

        chai.request(app)
            .get('/wines/58a5fbdabea9e2076eef8c54')
            .end((error, response) => {
                response.should.have.status(400);
                response.body.error.should.be.eql('UNKNOWN_OBJECT');
                done();
            });
    });
});
