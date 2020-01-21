var mongoose = require('mongoose');
var dbUrl = require('./properties').DB;

module.exports = function () {
    mongoose.connect(dbUrl, {
        useNewUrlParser: true
    });

    mongoose.connection.on('connected', function () {
        console.log(`Połączono z bazą ${dbUrl}`);
    })
};
