const Wine = require('../models/wine');
const sanitize = require('mongo-sanitize');

function sendUnknonwObject(response) {
    response.send(400, {error: 'UNKNOWN_OBJECT'});
}

module.exports = (server) => {

    server.post('/wines', (request, response, next) => {
        const wine = new Wine(request.body);

        wine.save().then((saved) => {
            response.send(201, saved);
            return next();
        }).catch((error) => {
            return next(error);
        });
    });

    server.get('/wines', (request, response, next) => {

        const query = {};
        if (request.params.year) {
            query['year'] = sanitize(request.params.year);
        }
        if (request.params.name) {
            query['name'] = sanitize(request.params.name);
        }
        if (request.params.type) {
            query['type'] = sanitize(request.params.type);
        }
        if (request.params.country) {
            query['country'] = sanitize(request.params.country);
        }

        Wine.find(query).then((result) => {
            response.send(200, result);
            return next();
        });
    });

    server.put('/wines/:id', (request, response, next) => {

        const id = sanitize(request.params.id);

        Wine.findOneAndUpdate({_id: id}, request.body, {new: true}).then((saved) => {

            if (saved) {
                response.send(200, saved);
            } else {
                sendUnknonwObject(response);
            }

            next();
        }).catch((error) => {
            return next(error);
        });
    });

    server.del('/wines/:id', (request, response, next) => {

        const id = sanitize(request.params.id);

        Wine.findByIdAndRemove({_id: id}).then((result) => {
            if(result){
                response.send(200, {success: true});
            } else {
                sendUnknonwObject(response);
            }
            next();
        }).catch((error) => {
            return next(error);
        });
    });
};