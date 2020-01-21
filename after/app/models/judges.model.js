var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var judgesSchema = new Schema({
    sedzia: {
        type: String,
        required: true
    },
    kraj: {
        type: String,
        required: true
    }
});

module.exports = judgesSchema;
