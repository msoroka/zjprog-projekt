var Classes = require('../../dao/classes.dao');
var Horses = require('../../dao/horses.dao');

exports.createClass = function (req, res, next) {
    var cl = {
        numer: req.body.numer,
        kat: req.body.kat,
        czempionat: req.body.czempionat,
        komisja: req.body.komisja
    };

    Classes.find({}, null, {sort: {numer: 1}}, function (err, classes) {
        classes.forEach(val => {
            if (val.numer >= req.body.numer) {
                Horses.find({klasa: val.numer}, function (err, horses) {
                    horses.forEach(horse => {
                        horse.klasa = val.numer + 1;
                        Horses.update({_id: horse._id}, horse, function (err, horse) {
                        });
                    });

                    return horses;
                }).then(function () {
                    val.numer = val.numer + 1;
                    Classes.update({_id: val._id}, val, function (err, val) {
                    });

                    return val;
                });
            }
        });

        return classes;
    }).then(function () {
        Classes.create(cl, function (err, cl) {
            if (err) {
                res.json({
                    error: err
                })
            }
            res.send(cl);
        });
    });
};

exports.getClass = function (req, res, next) {
    Classes.get({_id: req.params.id}, function (err, cl) {
        if (err) {
            res.json({
                error: err
            })
        }
        res.send(cl);
    })
};

exports.getClasses = function (req, res, next) {
    Classes.find({}, null, {sort: {numer: 1}}, function (err, classes) {
        if (err) {
            res.json({
                error: err
            })
        }
        res.send(classes);
    });
};

let updateRestClass = (req, newCl) => {
    Classes.findOne({_id: req.params.id}, function (err, cl) {
        return Classes.find({}, null, {sort: {numer: 1}}, function (err, classes) {
            Classes.distinct('numer', null, function (err, classesNumber) {
                if (cl.numer != newCl.numer) {
                    return classes.forEach(val => {
                        if (parseInt(val.numer) >= parseInt(newCl.numer) && classesNumber.includes(parseInt(newCl.numer))
                            && !val._id.equals(cl._id)) {
                            val.numer = parseInt(val.numer + 1);
                            Classes.update({_id: val._id}, val, function (err, cl) {
                                Horses.find({klasa: val.numer - 1}, function (err, horses) {
                                    horses.forEach(horse => {
                                        horse.klasa = val.numer;
                                        Horses.update({_id: horse._id}, horse, function (err, horse) {
                                        });
                                    });

                                });
                            });
                        }
                    });
                }
            }).then(function () {
                return Horses.find({klasa: cl.numer}, function (err, horses) {
                    if (cl.numer != newCl.numer) {
                        horses.forEach(horse => {
                            horse.klasa = newCl.numer;
                            Horses.update({_id: horse._id}, horse, function (err, horse) {
                            });
                        });
                    }
                })
            }).then(function () {
                return Classes.update({_id: req.params.id}, newCl, function (err, cl) {
                });
            });
        });
    }).then(() => {
    });
};

exports.updateClass = function (req, res, next) {
    var newCl = {
        numer: req.body.numer,
        kat: req.body.kat,
        czempionat: req.body.czempionat,
        komisja: req.body.komisja
    };

    updateRestClass(req, newCl);
    res.json({
        message: "Class updated successfully"
    });
};

exports.removeClass = function (req, res, next) {
    Classes.delete({_id: req.params.id}, function (err, cl) {
        if (err) {
            res.json({
                error: err
            })
        }
        res.json({
            message: "Class deleted successfully"
        })
    })
};
