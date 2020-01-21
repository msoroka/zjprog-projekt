const Horse = require("../dao/horse.dao");
const Class = require("../dao/class.dao");
const classClass = require("../plugins/closeClass");
const guardNumer = require("../helpers/guardNumer");

const checkForDeleteOrUpdate = (id) => {
    return Horse.getById(id).ocena === 1;
};
const checkIfClassAlreadyClosed = (id) => {
    let obj = Class.getById(id);
    return obj.ocena === 0 || obj.ocena === 1;
};

const gradeHorse = (horseGrade, horse, arbitrator) => {
    horse.ocena = 1;
    if (arbitrator) {
        horse.wynik = horseGrade;
    } else {
        horse.wynik.noty = horseGrade;
    }
    Horse.update(horse);
    return horse;
};

exports.getHorse = (_req, res) => {
    return res.json(
        Horse.get()
    );
};

exports.getHorseById = (req, res) => {
    return res.json(
        Horse.getById(req.params.id)
    );
};

exports.removeHorse = (req, res) => {
    if (checkForDeleteOrUpdate(req.params.id)) {
        return res.status(200).json({
            message: "Nie możesz usunąć tego konia."
        });
    }
    try {
        let obj = Horse.getById(req.params.id);
        if (!obj) {
            return res.status(404).send("");
        }
        guardNumer.changeNumerOnRemove(Horse,obj.numer);
        Horse.remove(obj);
    } catch (error) {
        console.log(error);
    }
    return res.status(200).send("");
};

exports.saveHorse = (req, res) => {
    let horse = req.body;
    if (checkIfClassAlreadyClosed(horse.klasa)) {
        return res.status(200).json({
            message: "Nie możesz wybrać tej klasy."
        });
    }
    horse.numer = guardNumer.changeNumerOnSave(Horse,horse.numer);
    let classOfHorse = Class.getById(horse.klasa);
    horse.wynik.noty = [];
    classOfHorse.komisja.forEach(el => {
        horse.wynik.noty.push({
            "typ": 0,
            "glowa": 0,
            "kloda": 0,
            "nogi": 0,
            "ruch": 0
        });
    });
    horse.ocena = -1;
    return res.status(201).json(Horse.save(horse));
};

exports.updateHorse = (req, res) => {
    let horseUpdate = req.body;
    console.log(horseUpdate);
    if (checkForDeleteOrUpdate(horseUpdate.$loki)) {
        return res.status(200).json({
            message: "Nie możesz zaktualizować tego konia."
        });
    }
    if (checkIfClassAlreadyClosed(horseUpdate.klasa)) {
        return res.status(200).json({
            message: "Nie możesz wybrać tej klasy."
        });
    }
    let beforeUpdate = Horse.getById(horseUpdate.$loki);
    if (horseUpdate.numer !== beforeUpdate.numer) {
        guardNumer.changeNumerOnUpdate(Horse,beforeUpdate,horseUpdate);
    }
    if (horseUpdate.klasa !== beforeUpdate.klasa) {
        let classOfHorse = Class.getById(horseUpdate.klasa);
        horseUpdate.wynik.noty = [];
        classOfHorse.komisja.forEach(el => {
            horseUpdate.wynik.noty.push({
                "typ": 0,
                "glowa": 0,
                "kloda": 0,
                "nogi": 0,
                "ruch": 0
            });
        });
    }
    Horse.update(horseUpdate);
    return res.status(201).json(horseUpdate);
};

exports.gradeHorse = (req, res) => {
    let horseGrade = req.body;
    let horse = Horse.getById(req.params.id);
    let grade = Class.getById(horse.klasa).ocena;
    if (grade === -1) {
        return res.status(200).json({
            message: "Klasa tego konia nie jest otwarta.",
            redirect: true
        });
    }
    if (grade === 1) {
        return res.status(200).json({
            message: "Klasa tego konia została już oceniona.",
            redirect: true
        });
    }
    if (horse.ocena === 1) {
        return res.status(200).json({
            message: "Ten koń został już oceniony.",
            redirect: true
        });
    }
    gradeHorse(horseGrade, horse, false);
    return res.status(201).send("");
};

exports.arbitrator = (req, res) => {
    let horseGrade = req.body;
    horseGrade.forEach(el => {
        gradeHorse(el.wynik, el, true);
    });
    let response = classClass.closeClass(horseGrade[0].klasa, true);
    if (response.status === 200) {
        if (response.horses === undefined) {
            return res.status(200).json({
                message: response.message
            });
        }
    }
    return res.status(201).send("");
};