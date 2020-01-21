var express = require('express');
var db = require('./config/database');
var routes = require('./routes/index');
var socket = require('./app/websockets/socket');
var libraries = require('./config/libraries');
var properties = require('./config/properties');
var app = express();
var router = express.Router();

db();
libraries(app);

var server = require('http').createServer(app);
socket(server);

app.use(router);
routes(router);

server.listen(properties.PORT, () => {
    console.log(`Serwer działa na porcie ${properties.PORT}`);
});
