var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var classesSchema = new Schema({
    numer: {
        type: Number,
        required: true
    },
    kat: {
        type: String,
        required: true
    },
    czempionat: {
        type: Number,
        required: true
    },
    komisja: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        required: false,
        default: "kolejka"
    }
});

module.exports = classesSchema;
