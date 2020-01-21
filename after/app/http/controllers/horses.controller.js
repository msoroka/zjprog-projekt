var Horses = require('../../dao/horses.dao');
var Classes = require('../../dao/classes.dao');

exports.createHorse = function (req, res, next) {
    var horse = {
        numer: req.body.numer,
        klasa: req.body.klasa,
        nazwa: req.body.nazwa,
        kraj: req.body.kraj,
        rocznik: req.body.rocznik,
        masc: req.body.masc,
        plec: req.body.plec,
        hodowca: req.body.hodowca,
        wlasciciel: req.body.wlasciciel,
        rodowod: req.body.rodowod,
        wynik: req.body.wynik,
    };

    horse.wynik = {
        noty: []
    };

    Horses.find({}, function (err, horses) {
        horses.forEach(val => {
            if (val.numer >= req.body.numer) {
                val.numer = val.numer + 1;
                Horses.update({_id: val._id}, val, function (err, val) {
                });
            }
        });

        return horses;
    }).then(function () {
        Horses.create(horse, function (err, horse) {
            if (err) {
                res.json({
                    error: err
                })
            }

            res.send(horse);
        });
    });
};

exports.getHorse = function (req, res, next) {
    Horses.get({_id: req.params.id}, function (err, horse) {
        if (err) {
            res.json({
                error: err
            })
        }
        res.send(horse);
    })
};

exports.getHorses = function (req, res, next) {
    Horses.find({}, null, {sort: {numer: 1}}, function (err, horses) {
        if (err) {
            res.json({
                error: err
            })
        }
        res.send(horses);
    })
};

exports.updateHorse = function (req, res, next) {
    var horse = {
        numer: req.body.numer,
        klasa: req.body.klasa,
        nazwa: req.body.nazwa,
        kraj: req.body.kraj,
        rocznik: req.body.rocznik,
        masc: req.body.masc,
        plec: req.body.plec,
        hodowca: req.body.hodowca,
        wlasciciel: req.body.wlasciciel,
        rodowod: req.body.rodowod,
        wynik: req.body.wynik,
        _id: req.body._id
    };

    let cases = 0;

    Horses.findOne({_id: req.params.id}, function (err, h) {
        Horses.find({}, null, {sort: {numer: 1}}, function (err, horses) {
            if (h.numer !== req.body.numer) {
                horses.forEach(val => {
                    if (val.numer == req.body.numer) {
                        val.numer = h.numer;
                        Horses.update({_id: val._id}, val, function (err, val) {
                        });
                    }
                });
            }

            return horses;
        }).then(function () {
            Classes.findOne({numer: req.body.klasa}, function (err, cl) {
                if (h.klasa !== req.body.klasa) {
                    horse.wynik = {
                        noty: []
                    };
                }
            }).then(function () {
                Horses.update({_id: req.params.id}, horse, function (err, horse) {
                    if (err) {
                        res.json({
                            error: err
                        })
                    }

                    res.json(horse);
                });

                return horse;
            });

            return horse;
        });
    });
};

exports.removeHorse = function (req, res, next) {
    Horses.delete({_id: req.params.id}, function (err, horse) {
        if (err) {
            res.json({
                error: err
            })
        }

        res.json(horse);
    })
};
