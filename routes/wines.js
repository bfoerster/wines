
const Wine = require('../models/wine');

module.exports = (server) => {

    server.post('/wines', (request, response, next) => {
        const wine = new Wine(request.body);

        wine.save().then((saved) => {
            response.send(201, saved);
            return next();
        });
    });

    server.get('/wines', (request, response, next) => {
        response.send(200, []);
        return next();
    });
};