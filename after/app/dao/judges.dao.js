var mongoose = require('mongoose');
var judgesSchema = require('../models/judges.model');

judgesSchema.statics = {
    create: function (data, cb) {
        var judge = new this(data);
        judge.save(cb);
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

var judgesModel = mongoose.model('Judges', judgesSchema);
module.exports = judgesModel;
