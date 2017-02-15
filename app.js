
const restify = require('restify');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const dbUri = process.env.DB_URI || 'mongodb://localhost:27017/wines';

mongoose.connect(dbUri).then(() => {
    console.log('Connection to database successful');
}).catch((error) => {
    console.log(error);
});

const server = restify.createServer();

server
    .use(restify.fullResponse())
    .use(restify.bodyParser());

require('./routes/wines.js')(server);

const port = process.env.PORT || 8080;
server.listen(port);

module.exports = server;