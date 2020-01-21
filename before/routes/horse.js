const express = require("express");
const router = express.Router();
const db = require("../database/db");
router.get("/", (_req, res) => {
    let horses = db.getCollection("horse").chain().find().simplesort("numer", false).data();
    return res.json(
        horses
    );
});
router.get("/:id", (req, res) => {
    let horse = db.getCollection("horse").findOne({ "$loki": parseInt(req.params.id) });
    return res.json(
        horse
    );
});
const checkForDeleteOrUpdate = (id) => {
    let objHorse = db.getCollection("horse").findOne({ "$loki": parseInt(id) });
    return objHorse.ocena === 1;
};
const checkIfClassAlreadyClosed = (id) => {
    let obj = db.getCollection("class").findOne({ "$loki": parseInt(id) });
    return obj.ocena === 0 || obj.ocena === 1;
};
const trimObj = (obj) => {
    const trimFunction = (objN) => {
        Object.keys(objN).forEach(function (key) {
            if (typeof objN[key] === "string") {
                objN[key] = objN[key].trim();
            } else if (typeof objN[key] === "object") {
                trimFunction(objN[key]);
            }
        });
    };
    trimFunction(obj);
};

const validatePoints = (obj) => {
    const validate = (v) => {
        return (parseFloat(v) >= 0) && ((v >= 0 && v <= 20) && ((v * 10) % 5 === 5 || (v * 10) % 5 === 0));
    };
    if (obj.noty !== undefined) {
        obj = obj.noty;
    }
    for (let i = 0; i < obj.length; i++) {
        let el = obj[i];
        if (!validate(el.typ) || !validate(el.glowa) || !validate(el.kloda) || !validate(el.nogi) || !validate(el.ruch)) {
            return true;
        }
    }
    return false;
};

const validateHorse = (horse, method) => {
    const arrayOfKeys = ["$loki", "meta", "ocena", "wynik", "rozjemca"];
    const validate = (objN) => {
        for (let key in objN) {
            if (arrayOfKeys.indexOf(key) === -1) {
                let obj = objN[key];
                if (typeof obj === "string") {
                    if (!obj || obj.length > 30 || !obj.match(/^[A-Za-z .]+$/) || !!obj.match(/^\s*$/)) {
                        return true;
                    }
                } else if (typeof obj === "number") {
                    if (!obj || obj <= 0) {
                        return true;
                    }
                } else if (typeof obj === "object") {
                    validate(obj);
                }
            }
        }
        if (method) {
            return validatePoints(horse.wynik);
        }
        return false;
    };
    return validate(horse);
};
const moveNumer = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].ocena === 1) {
            return true;
        }
    }
    return false;
};
router.delete("/:id", (req, res) => {
    if (checkForDeleteOrUpdate(req.params.id)) {
        return res.status(200).json({ message: "Nie możesz usunąć tego konia." });
    }
    try {
        let obj = db.getCollection("horse").findOne({ "$loki": parseInt(req.params.id) });
        if (!obj) {
            return res.status(404).send("");
        }
        let list = db.getCollection("horse").find({ "numer": { "$gt": obj.numer } });
        if (moveNumer(list)) {
            return res.status(200).json({ message: "Ciągłość numerów została zaburzona." });
        }
        list.forEach(el => {
            el.numer--;
            db.getCollection("horse").update(el);
        });
        db.getCollection("horse").remove(obj);
    } catch (error) {
        console.log(error);
    }
    return res.status(200).send("");
});
router.post("/", (req, res) => {
    let horse = req.body;
    if (checkIfClassAlreadyClosed(horse.klasa)) {
        return res.status(200).json({ message: "Nie możesz wybrać tej klasy." });
    }
    if (validateHorse(horse, false)) {
        return res.status(200).json({ message: "Niepoprawne dane." });
    }
    let lastClass = db.getCollection("horse").chain().find().simplesort("numer", true).data();
    if (lastClass.length > 0) {
        if (horse.numer > lastClass[0].numer) {
            horse.numer = lastClass[0].numer + 1;
        } else {
            let numberEqOrHigher = db.getCollection("horse").find({ "numer": { "$gte": horse.numer } });
            if (moveNumer(numberEqOrHigher)) {
                return res.status(200).json({ message: "Ciągłość numerów została zaburzona." });
            }
            numberEqOrHigher.forEach(el => {
                el.numer++;
                db.getCollection("horse").update(el);
            });
        }
    } else {
        horse.numer = 1;
    }
    let classOfHorse = db.getCollection("class").findOne({ "$loki": horse.klasa });
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
    trimObj(horse);
    horse.ocena = -1;
    db.getCollection("horse").insert(horse);
    return res.status(201).json(horse);
});
router.put("/", (req, res) => {
    let horseUpdate = req.body;
    if (validateHorse(horseUpdate, true)) {
        return res.status(200).json({ message: "Niepoprawne dane." });
    }
    if (checkForDeleteOrUpdate(horseUpdate.$loki)) {
        return res.status(200).json({ message: "Nie możesz zaktualizować tego konia." });
    }
    if (checkIfClassAlreadyClosed(horseUpdate.klasa)) {
        return res.status(200).json({ message: "Nie możesz wybrać tej klasy." });
    }
    let beforeUpdate = db.getCollection("horse").findOne({ "$loki": horseUpdate.$loki });
    if (horseUpdate.numer !== beforeUpdate.numer) {
        let lastClass = db.getCollection("horse").chain().find().simplesort("numer", true).data()[0];
        if (horseUpdate.numer > lastClass.numer) {
            if (horseUpdate.$loki !== lastClass.$loki) {
                let classesToChangeNumberDown = db.getCollection("horse").find({ "numer": { "$gt": beforeUpdate.numer } });
                if (moveNumer(classesToChangeNumberDown)) {
                    return res.status(200).json({ message: "Ciągłość numerów została zaburzona." });
                }
                classesToChangeNumberDown.forEach(el => {
                    el.numer--;
                    db.getCollection("horse").update(el);
                });
                horseUpdate.numer = lastClass.numer + 1;
            } else {
                horseUpdate.numer = lastClass.numer;
            }
        } else {
            if (beforeUpdate.numer < horseUpdate.numer) {
                let classesToChangeNumberDown = db.getCollection("horse").find({ "numer": { "$between": [beforeUpdate.numer + 1, horseUpdate.numer] } });
                if (moveNumer(classesToChangeNumberDown)) {
                    return res.status(200).json({ message: "Ciągłość numerów została zaburzona." });
                }
                classesToChangeNumberDown.forEach(el => {
                    el.numer--;
                    db.getCollection("horse").update(el);
                });
            } else if (beforeUpdate.numer > horseUpdate.numer) {
                let classesToChangeNumberUp = db.getCollection("horse").find({ "numer": { "$between": [horseUpdate.numer, beforeUpdate.numer - 1] } });
                if (moveNumer(classesToChangeNumberUp)) {
                    return res.status(200).json({ message: "Ciągłość numerów została zaburzona." });
                }
                classesToChangeNumberUp.forEach(el => {
                    el.numer++;
                    db.getCollection("horse").update(el);
                });
            }
        }
    }
    if (horseUpdate.klasa !== beforeUpdate.klasa) {
        let classOfHorse = db.getCollection("class").findOne({ "$loki": horseUpdate.klasa });
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
    trimObj(horseUpdate);
    db.getCollection("horse").update(horseUpdate);
    return res.status(201).json(horseUpdate);
});

const gradeHorse = (horseGrade, horse, arbitrator) => {
    horse.ocena = 1;
    if (arbitrator) {
        horse.wynik = horseGrade;
    } else {
        horse.wynik.noty = horseGrade;
    }
    db.getCollection("horse").update(horse);
    return horse;
};
router.put("/:id", (req, res) => {
    let horseGrade = req.body;
    if (validatePoints(horseGrade)) {
        return res.status(200).json({ message: "Niepoprawne dane." });
    }
    let horse = db.getCollection("horse").findOne({ "$loki": parseInt(req.params.id) });
    let grade = db.getCollection("class").findOne({ "$loki": horse.klasa }).ocena;
    if (grade === -1) {
        return res.status(200).json({ message: "Klasa tego konia nie jest otwarta.", redirect: true });
    }
    if (grade === 1) {
        return res.status(200).json({ message: "Klasa tego konia została już oceniona.", redirect: true });
    }
    if (horse.ocena === 1) {
        return res.status(200).json({ message: "Ten koń został już oceniony.", redirect: true });
    }
    gradeHorse(horseGrade, horse, false);
    return res.status(201).send("");
});
const classClass = require("../plugins/closeClass");
router.put("/:id/arbitrator", (req, res) => {
    let horseGrade = req.body;
    horseGrade.forEach(el => {
        if (validatePoints(el.wynik)) {
            return res.status(200).json({ message: "Niepoprawne dane." });
        }
    });
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
});
module.exports = router;
