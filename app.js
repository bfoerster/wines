const restify = require('restify');
const mongoose = require('mongoose');
const log = require('npmlog');
const errorhandler = require('./errors/error_handler');

mongoose.Promise = global.Promise;
const dbUri = process.env.DB_URI || 'mongodb://localhost:27017/wines';

mongoose.connect(dbUri).then(() => {
    log.info('Connection to database successful');
}).catch((error) => {
    log.error(error);
});

const server = restify.createServer();

server
    .use(restify.queryParser())
    .use(restify.fullResponse())
    .use(restify.bodyParser());

server.use((request, response, next) => {
    response.charSet('utf-8');
    return next();
});

server.on('Validation', errorhandler);

require('./routes/wines.js')(server);

const port = process.env.PORT || 8080;
server.listen(port);


module.exports = server;