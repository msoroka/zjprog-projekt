const Class = require("../dao/class.dao");
const Horse = require("../dao/horse.dao");
const guardNumer = require("../helpers/guardNumer");
const checkForDeleteOrUpdate = (id) => {
    return Horse.getByKlasa(id).length > 0 || Class.getById(id).ocena === 1;
};

const closeClass = require("../plugins/closeClass");
exports.getClass = (req, res) => {
    return res.json(
        Class.get()
    );
};

exports.getClassById = (req, res) => {
    return res.json(
        Class.getById(req.params.id)
    );
};

exports.horsesFromClass = (req, res) => {
    let classdb = Class.getById(req.params.id);
    if (classdb.ocena === 0) {
        return res.status(200).json(
            Horse.getByKlasa(req.params.id)
        );
    }
    return res.status(200).json({
        message: "Ta klasa nie może zostać oceniona."
    });
};

exports.removeClass = (req, res) => {
    if (checkForDeleteOrUpdate(req.params.id)) {
        return res.status(200).json({
            message: "Nie możesz usunąć tej klasy."
        });
    }
    try {
        let obj = Class.getById(req.params.id);
        if (!obj) {
            return res.status(404).send("");
        }
       guardNumer.changeNumerOnRemove(Class,obj.numer);
        Class.remove(obj);
    } catch (error) {
        console.log(error);
    }
    return res.status(200).send("");
};

exports.saveClass = (req, res) => {
    let classInsert = req.body;
    let checkIfClosedByNumber = Class.getByNumer(classInsert.numer);
    if (checkIfClosedByNumber) {
        if (Horse.getByKlasa(checkIfClosedByNumber.$loki).length > 0) {
            return res.status(200).json({
                message: "Klasa z takim numerem jest już jest zajęta."
            });
        }
        if (checkIfClosedByNumber.ocena === 0 || checkIfClosedByNumber.ocena === 1) {
            return res.status(200).json({
                message: "Klasa z tym numerem już została oceniona."
            });
        }
    }
    classInsert.numer = guardNumer.changeNumerOnSave(Class,classInsert.numer);
    classInsert.ocena = -1; // -1 nie ocena, 0 oceniana (max 1), 1 ocena
    return res.status(201).json(Class.save(classInsert));
};

exports.closeClass = (req, res) => {
    let response = null;
    if (req.body.alreadyRated && req.body.horsesArray) {
        response = closeClass.closeClass(req.params.id, req.body.alreadyRated);
    } else {
        response = closeClass.closeClass(req.params.id, false, null);
    }
    if (response.status === 200) {
        if (response.horses === undefined) {
            return res.status(200).json({
                message: response.message
            });
        } else {
            return res.status(200).json({
                horses: response.horses
            });
        }
    }
    return res.status(201).send("");
};

exports.updateClass = (req, res) => {
    let classUpdate = req.body;
    if (checkForDeleteOrUpdate(classUpdate.$loki)) {
        return res.status(200).json({ message: "Nie możesz zaktualizować tej klasy." });
    }
    let beforeUpdate = Class.getById(classUpdate.$loki);
    if (classUpdate.numer !== beforeUpdate.numer) {
        let checkIfClosedByNumber = Class.getByNumer(classUpdate.numer);
        if (checkIfClosedByNumber) {
            if (checkIfClosedByNumber.ocena === 0 || checkIfClosedByNumber.ocena === 1) {
                return res.status(200).json({ message: "Klasa z tym numerem już została oceniona." });
            }
        }
        guardNumer.changeNumerOnUpdate(Class,beforeUpdate,classUpdate);
    }
    Class.update(classUpdate);
    return res.status(201).json(classUpdate);
};