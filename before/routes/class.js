const express = require("express");
const router = express.Router();
const db = require("../database/db");
router.get("/", (_req, res) => {
    let classDb = db.getCollection("class").chain().find().simplesort("numer", false).data();
    return res.json(
        classDb
    );
});
router.get("/:id", (req, res) => {
    let classDb = db.getCollection("class").findOne({ "$loki": parseInt(req.params.id) });
    return res.json(
        classDb
    );
});
router.get("/:id/horses", (req, res) => {
    let classdb = db.getCollection("class").findOne({ "$loki": parseInt(req.params.id) });
    if (classdb.ocena === 0) {
        return res.status(200).json(
            db.getCollection("horse").find({ "klasa": parseInt(req.params.id) })
        );
    }
    return res.status(200).json(
        { message: "Ta klasa nie może zostać oceniona." }
    );
});
const checkForDeleteOrUpdate = (id) => {
    let obj = db.getCollection("horse").find({ "klasa": parseInt(id) });
    return obj.length > 0 || db.getCollection("class").findOne({ "$loki": parseInt(id) }).ocena === 1;
};
const validateClass = (obj) => {
    if (!obj.kat || obj.kat.length > 30 || !!obj.kat.match(/^\s*$/)) { return true; }
    if (!obj.numer || obj.numer <= 0) { return true; }
    if (obj.komisja.length <= 0) { return true; }
    return false;
};
router.delete("/:id", (req, res) => {
    if (checkForDeleteOrUpdate(req.params.id)) {
        return res.status(200).json({ message: "Nie możesz usunąć tej klasy." });
    }
    try {
        let obj = db.getCollection("class").findOne({ "$loki": parseInt(req.params.id) });
        if (!obj) {
            return res.status(404).send("");
        }
        let list = db.getCollection("class").find({ "numer": { "$gt": obj.numer } });
        if (moveNumer(list)) {
            return res.status(200).json({ message: "Ciągłość numerów została zaburzona." });
        }
        list.forEach(el => {
            el.numer--;
            db.getCollection("class").update(el);
        });
        db.getCollection("class").remove(obj);
    } catch (error) {
        console.log(error);
    }
    return res.status(200).send("");
});
const moveNumer = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].ocena === 0 || arr[i].ocena === 1) {
            return true;
        }
    }
    return false;
};
router.post("/", (req, res) => {
    let classInsert = req.body;
    if (validateClass(classInsert)) {
        return res.status(200).json({ message: "Niepoprawne dane." });
    }
    let checkIfClosedByNumber = db.getCollection("class").findOne({ "numer": classInsert.numer });
    if (checkIfClosedByNumber) {
        if (db.getCollection("horse").find({ "klasa": checkIfClosedByNumber.$loki }).length > 0) {
            return res.status(200).json({ message: "Klasa z takim numerem jest już jest zajęta." });
        }
        if (checkIfClosedByNumber.ocena === 0 || checkIfClosedByNumber.ocena === 1) {
            return res.status(200).json({ message: "Klasa z tym numerem już została oceniona." });
        }
    }
    let lastClass = db.getCollection("class").chain().find().simplesort("numer", true).data();
    if (lastClass.length > 0) {
        if (classInsert.numer > lastClass[0].numer) {
            classInsert.numer = lastClass[0].numer + 1;
        } else {
            let numberEqOrHigher = db.getCollection("class").find({ "numer": { "$gte": classInsert.numer } });
            if (moveNumer(numberEqOrHigher)) {
                return res.status(200).json({ message: "Ciągłość numerów została zaburzona." });
            }
            numberEqOrHigher.forEach(el => {
                el.numer++;
                db.getCollection("class").update(el);
            });
        }
    } else {
        classInsert.numer = 1;
    }
    classInsert.ocena = -1; // -1 nie ocena, 0 oceniana (max 1), 1 ocena
    classInsert.kat = classInsert.kat.trim();
    db.getCollection("class").insert(classInsert);
    return res.status(201).json(classInsert);
});
const closeClass = require("../plugins/closeClass");
router.put("/:id", (req, res) => {
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
});

router.put("/", (req, res) => {
    let classUpdate = req.body;
    if (checkForDeleteOrUpdate(classUpdate.$loki)) {
        return res.status(200).json({ message: "Nie możesz zaktualizować tej klasy." });
    }
    if (validateClass(classUpdate)) {
        return res.status(200).json({ message: "Niepoprawne dane." });
    }
    let beforeUpdate = db.getCollection("class").findOne({ "$loki": classUpdate.$loki });
    if (classUpdate.numer !== beforeUpdate.numer) {
        let checkIfClosedByNumber = db.getCollection("class").findOne({ "numer": classUpdate.numer });
        if (checkIfClosedByNumber) {
            if (checkIfClosedByNumber.ocena === 0 || checkIfClosedByNumber.ocena === 1) {
                return res.status(200).json({ message: "Klasa z tym numerem już została oceniona." });
            }
        }
        let lastClass = db.getCollection("class").chain().find().simplesort("numer", true).data()[0];
        if (classUpdate.numer > lastClass.numer) {
            if (classUpdate.$loki !== lastClass.$loki) {
                let classesToChangeNumberDown = db.getCollection("class").find({ "numer": { "$gt": beforeUpdate.numer } });
                if (moveNumer(classesToChangeNumberDown)) {
                    return res.status(200).json({ message: "Ciągłość numerów została zaburzona." });
                }
                classesToChangeNumberDown.forEach(el => {
                    el.numer--;
                    db.getCollection("horse").update(el);
                });
                classUpdate.numer = lastClass.numer + 1;
            } else {
                classUpdate.numer = lastClass.numer;
            }
        } else {
            if (beforeUpdate.numer < classUpdate.numer) {
                let classesToChangeNumberDown = db.getCollection("class").find({ "numer": { "$between": [beforeUpdate.numer + 1, classUpdate.numer] } });
                if (moveNumer(classesToChangeNumberDown)) {
                    return res.status(200).json({ message: "Ciągłość numerów została zaburzona." });
                }
                classesToChangeNumberDown.forEach(el => {
                    el.numer--;
                    db.getCollection("class").update(el);
                });
            } else if (beforeUpdate.numer > classUpdate.numer) {
                let classesToChangeNumberUp = db.getCollection("class").find({ "numer": { "$between": [classUpdate.numer, beforeUpdate.numer - 1] } });
                if (moveNumer(classesToChangeNumberUp)) {
                    return res.status(200).json({ message: "Ciągłość numerów została zaburzona." });
                }
                classesToChangeNumberUp.forEach(el => {
                    el.numer++;
                    db.getCollection("class").update(el);
                });
            }
        }
    }
    classUpdate.kat = classUpdate.kat.trim();
    db.getCollection("class").update(classUpdate);
    return res.status(201).json(classUpdate);
});

module.exports = router;
