const restify = require('restify');

const server = restify.createServer();

server
    .use(restify.fullResponse())
    .use(restify.bodyParser());

require('./routes/wines.js')(server);

const port = process.env.PORT || 8080;
server.listen(port);

module.exports = server;