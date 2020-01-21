var libraries = function (app) {
    var cors = require('cors');
    var cookieParser = require('cookie-parser');
    var log = require('morgan')('dev');
    var bodyParser = require('body-parser');

    app.use(log);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(cookieParser());
    app.use(cors({
        credentials: true,
        origin: function (origin, callback) {
            return callback(null, true);
        },
    }));
};

module.exports = libraries;
