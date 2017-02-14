

module.exports = function (server) {
    server.get('/wines', function(request, response, next){
        response.send(200);
        return next();
    });
};