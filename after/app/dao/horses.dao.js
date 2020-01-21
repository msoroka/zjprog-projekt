var mongoose = require('mongoose');
var horsesSchema = require('../models/horses.model');

horsesSchema.statics = {
    create: function (data, cb) {
        var horse = new this(data);
        horse.save(cb);
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

var horsesModel = mongoose.model('Horses', horsesSchema);
module.exports = horsesModel;
