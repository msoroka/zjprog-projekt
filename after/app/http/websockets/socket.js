var Horses = require('../../dao/horses.dao');
var Classes = require('../../dao/classes.dao');
var compare = require('../../helpers/compare');
var socketIo = require('socket.io');

var socket = function (server) {
    var sio = socketIo.listen(server);
    sio.sockets.on('connection', function (socket) {
        socket.on('ranking', function (data) {
            Horses.find({}, null, {sort: {klasa: 1}}, function (err, horses) {
                sio.emit('ranking', horses.sort(compare));
            });
        });
        socket.on('klasa', function (data) {
            if (data) {
                Classes.findOne({_id: data.klasa._id}, function (err, cl) {
                    cl.status = data.status;
                    Classes.update({_id: cl._id}, cl, function (err, cl) {
                    });
                });
            }

            Classes.find({}, null, {sort: {numer: 1}}, function (err, classes) {
                if (data) {
                    classes.forEach(val => {
                        if (val._id == data.klasa._id) {
                            val.status = data.status;
                        }
                    })
                }
                sio.emit('klasa', classes);
            });
        });
    });
};

module.exports = socket;
