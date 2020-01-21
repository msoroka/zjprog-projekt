const express = require("express");
const router = express.Router();
const db = require("../database/db");
router.get("/", (req, res) => {
    let judges;
    if (req.query.id !== undefined) {
        let idArray = [];
        req.query.id.split(",").forEach(el => {
            idArray.push(parseInt(el));
        });
        judges = db.getCollection("judge").find({ "$loki": { "$in": idArray } });
    } else {
        judges = db.getCollection("judge").find();
    }
    return res.json(
        judges
    );
});
router.get("/:id", (req, res) => {
    let judge = db.getCollection("judge").findOne({ "$loki": parseInt(req.params.id) });
    return res.json(
        judge
    );
});
const checkForDeleteOrUpdate = (id) => {
    let obj = db.getCollection("class").find({ "komisja": { "$contains": parseInt(id) } });
    return obj.length > 0;
};
const validateJudge = (obj) => {
    if (!obj.sedzia || obj.sedzia.length > 200 || !obj.sedzia.match(/^[A-Za-z .]+$/) || !!obj.sedzia.match(/^\s*$/)) { return true; }
    if (!obj.kraj) { return true; }
    return false;
};
router.delete("/:id", (req, res) => {
    if (checkForDeleteOrUpdate(req.params.id)) {
        return res.status(200).json({ message: "Nie możesz usunąć tego sędziego." });
    }
    try {
        let obj = db.getCollection("judge").findOne({ "$loki": parseInt(req.params.id) });
        if (!obj) {
            return res.status(404).send("");
        }
        db.getCollection("judge").remove(obj);
    } catch (error) {
        console.log(error);
    }
    return res.status(200).send("");
});
router.post("/", (req, res) => {
    let judge = req.body;
    if (validateJudge(judge)) {
        return res.status(200).json({ message: "Niepoprawne dane." });
    }
    judge.sedzia = judge.sedzia.trim();
    db.getCollection("judge").insert(judge);
    return res.status(201).json(judge);
});
router.put("/", (req, res) => {
    let judgeReq = req.body;
    if (validateJudge(judgeReq)) {
        return res.status(200).json({ message: "Niepoprawne dane." });
    }
    if (checkForDeleteOrUpdate(judgeReq.$loki)) {
        return res.status(200).json({ message: "Nie możesz zaktualizować tego sędziego." });
    }
    judgeReq.sedzia = judgeReq.sedzia.trim();
    db.getCollection("judge").update(judgeReq);
    return res.status(201).json(judgeReq);
});

module.exports = router;
