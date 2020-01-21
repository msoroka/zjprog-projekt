var mongoose = require('mongoose');
var classsSchema = require('../models/classes.model');

classsSchema.statics = {
    create: function (data, cb) {
        var cl = new this(data);
        cl.save(cb);
    },

    get: function (query, cb) {
        this.find(query, cb);
    },

    getById: function (query, cb) {
        this.find(query, cb);
    },

    update: function (query, data, cb) {
        this.findOneAndUpdate(query, {$set: data}, {new: true}, cb);
    },

    delete: function (query, cb) {
        this.findOneAndDelete(query, cb);
    }
};

var classsModel = mongoose.model('Classs', classsSchema);
module.exports = classsModel;
