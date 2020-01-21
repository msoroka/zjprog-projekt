var Judges = require('../../dao/judges.dao');

exports.createJudge = function (req, res, next) {
    if (req.isAuthenticated()) {
        var judge = {
            sedzia: req.body.sedzia,
            kraj: req.body.kraj
        };

        Judges.create(judge, function (err, judge) {
            if (err) {
                res.json({
                    error: err
                })
            }
            res.send(judge);
        })
    }
};

exports.getJudge = function (req, res, next) {
    Judges.get({_id: req.params.id}, function (err, judge) {
        if (err) {
            res.json({
                error: err
            })
        }
        res.send(judge);
    })
};

exports.getJudges = function (req, res, next) {
    Judges.get({}, function (err, judges) {
        if (err) {
            res.json({
                error: err
            })
        }
        res.send(judges);
    })
};

exports.updateJudge = function (req, res, next) {
    if (req.isAuthenticated()) {
        var judge = {
            sedzia: req.body.sedzia,
            kraj: req.body.kraj
        };

        Judges.update({_id: req.params.id}, judge, function (err, judge) {
            if (err) {
                res.json({
                    error: err
                })
            }
            res.json({
                message: "Judge updated successfully"
            })
        })
    }
};

exports.removeJudge = function (req, res, next) {
    if (req.isAuthenticated()) {
        Judges.delete({_id: req.params.id}, function (err, judge) {
            if (err) {
                res.json({
                    error: err
                })
            }
            res.json({
                message: "Judge deleted successfully"
            })
        })
    }
};
