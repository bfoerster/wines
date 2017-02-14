
const restify = require('restify');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const dbUri = 'mongodb://localhost:27017/wines';
mongoose.connect(dbUri);

const server = restify.createServer();

server
    .use(restify.fullResponse())
    .use(restify.bodyParser());

require('./routes/wines.js')(server);

const port = process.env.PORT || 8080;
server.listen(port);

module.exports = server;