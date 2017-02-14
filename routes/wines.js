

module.exports = function (server) {
    server.get('/wines', function(request, response, next){
        console.log("GET all wines");
        response.send(200);
        return next();
    });
};