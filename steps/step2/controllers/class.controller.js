const Class = require("../dao/class.dao");
const Horse = require("../dao/horse.dao");
const checkForDeleteOrUpdate = (id) => {
    return Horse.getByKlasa(id).length > 0 || Class.getById(id).ocena === 1;
};
const moveNumer = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].ocena === 0 || arr[i].ocena === 1) {
            return true;
        }
    }
    return false;
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
        let list = Class.getByNumerGreaterThan(obj.numer);
        if (moveNumer(list)) {
            return res.status(200).json({
                message: "Ciągłość numerów została zaburzona."
            });
        }
        list.forEach(el => {
            el.numer--;
            Class.update(el);
        });
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
    let lastClass = Class.getSortByNumerDesc();
    if (lastClass.length > 0) {
        if (classInsert.numer > lastClass[0].numer) {
            classInsert.numer = lastClass[0].numer + 1;
        } else {
            let numberEqOrHigher = Class.getByNumerGreaterOrEqualThan(classInsert.numer);
            if (moveNumer(numberEqOrHigher)) {
                return res.status(200).json({
                    message: "Ciągłość numerów została zaburzona."
                });
            }
            numberEqOrHigher.forEach(el => {
                el.numer++;
                Class.update(el);
            });
        }
    } else {
        classInsert.numer = 1;
    }
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
        let lastClass = Class.getSortByNumerDesc()[0];
        if (classUpdate.numer > lastClass.numer) {
            if (classUpdate.$loki !== lastClass.$loki) {
                let classesToChangeNumberDown = Class.getByNumerGreaterThan(beforeUpdate.numer);
                if (moveNumer(classesToChangeNumberDown)) {
                    return res.status(200).json({ message: "Ciągłość numerów została zaburzona." });
                }
                classesToChangeNumberDown.forEach(el => {
                    el.numer--;
                    Horse.update(el);
                });
                classUpdate.numer = lastClass.numer + 1;
            } else {
                classUpdate.numer = lastClass.numer;
            }
        } else {
            if (beforeUpdate.numer < classUpdate.numer) {
                let classesToChangeNumberDown = Class.getByNumerBetween(beforeUpdate.numer + 1,classUpdate.numer);
                if (moveNumer(classesToChangeNumberDown)) {
                    return res.status(200).json({ message: "Ciągłość numerów została zaburzona." });
                }
                classesToChangeNumberDown.forEach(el => {
                    el.numer--;
                    Class.update(el);
                });
            } else if (beforeUpdate.numer > classUpdate.numer) {
                let classesToChangeNumberUp = Class.getByNumerBetween(classUpdate.numer,beforeUpdate.numer - 1);
                if (moveNumer(classesToChangeNumberUp)) {
                    return res.status(200).json({ message: "Ciągłość numerów została zaburzona." });
                }
                classesToChangeNumberUp.forEach(el => {
                    el.numer++;
                    Class.update(el);
                });
            }
        }
    }
    Class.update(classUpdate);
    return res.status(201).json(classUpdate);
};