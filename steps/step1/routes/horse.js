const express = require("express");
const router = express.Router();
const Horse = require("../dao/horse.dao");
const Class = require("../dao/class.dao");
router.get("/", (_req, res) => {
    return res.json(
        Horse.get()
    );
});
router.get("/:id", (req, res) => {
    return res.json(
        Horse.getById(req.params.id)
    );
});
const checkForDeleteOrUpdate = (id) => {
    return Horse.getById(id).ocena === 1;
};
const checkIfClassAlreadyClosed = (id) => {
    let obj = Class.getById(id);
    return obj.ocena === 0 || obj.ocena === 1;
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
        let obj = Horse.getById(req.params.id);
        if (!obj) {
            return res.status(404).send("");
        }
        let list = Horse.getByNumerGreaterThan(obj.numer);
        if (moveNumer(list)) {
            return res.status(200).json({ message: "Ciągłość numerów została zaburzona." });
        }
        list.forEach(el => {
            el.numer--;
            Horse.update(el);
        });
        Horse.remove(obj);
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
    let lastClass = Horse.getSortByNumerDesc();
    if (lastClass.length > 0) {
        if (horse.numer > lastClass[0].numer) {
            horse.numer = lastClass[0].numer + 1;
        } else {
            let numberEqOrHigher = Horse.getByNumerGreaterOrEqualThan(horse.numer);
            if (moveNumer(numberEqOrHigher)) {
                return res.status(200).json({ message: "Ciągłość numerów została zaburzona." });
            }
            numberEqOrHigher.forEach(el => {
                el.numer++;
                Horse.update(el);
            });
        }
    } else {
        horse.numer = 1;
    }
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
});
router.put("/", (req, res) => {
    let horseUpdate = req.body;
    if (checkForDeleteOrUpdate(horseUpdate.$loki)) {
        return res.status(200).json({ message: "Nie możesz zaktualizować tego konia." });
    }
    if (checkIfClassAlreadyClosed(horseUpdate.klasa)) {
        return res.status(200).json({ message: "Nie możesz wybrać tej klasy." });
    }
    let beforeUpdate = Horse.getById(horseUpdate.$loki);
    if (horseUpdate.numer !== beforeUpdate.numer) {
        let lastClass = Horse.getSortByNumerDesc()[0];
        if (horseUpdate.numer > lastClass.numer) {
            if (horseUpdate.$loki !== lastClass.$loki) {
                let classesToChangeNumberDown = Horse.getByNumerGreaterThan(beforeUpdate.numer);
                if (moveNumer(classesToChangeNumberDown)) {
                    return res.status(200).json({ message: "Ciągłość numerów została zaburzona." });
                }
                classesToChangeNumberDown.forEach(el => {
                    el.numer--;
                    Horse.update(el);
                });
                horseUpdate.numer = lastClass.numer + 1;
            } else {
                horseUpdate.numer = lastClass.numer;
            }
        } else {
            if (beforeUpdate.numer < horseUpdate.numer) {
                let classesToChangeNumberDown = Horse.getByNumerBetween(beforeUpdate.numer + 1,classUpdate.numer);
                if (moveNumer(classesToChangeNumberDown)) {
                    return res.status(200).json({ message: "Ciągłość numerów została zaburzona." });
                }
                classesToChangeNumberDown.forEach(el => {
                    el.numer--;
                    Horse.update(el);
                });
            } else if (beforeUpdate.numer > horseUpdate.numer) {
                let classesToChangeNumberUp = Horse.getByNumerBetween(classUpdate.numer,beforeUpdate.numer - 1);
                if (moveNumer(classesToChangeNumberUp)) {
                    return res.status(200).json({ message: "Ciągłość numerów została zaburzona." });
                }
                classesToChangeNumberUp.forEach(el => {
                    el.numer++;
                    Horse.update(el);
                });
            }
        }
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
});

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
router.put("/:id", (req, res) => {
    let horseGrade = req.body;
    let horse = Horse.getById(req.params.id);
    let grade = Class.getById(horse.klasa).ocena;
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
