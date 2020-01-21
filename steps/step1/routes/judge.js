const express = require("express");
const router = express.Router();
const Judge = require("../dao/judge.dao");
const Class = require("../dao/class.dao");
router.get("/", (req, res) => {
    let judges;
    if (req.query.id !== undefined) {
        let idArray = [];
        req.query.id.split(",").forEach(el => {
            idArray.push(parseInt(el));
        });
        judges = Judge.getByIdArray(idArray);
    } else {
        judges = Judge.get();
    }
    return res.json(
        judges
    );
});
router.get("/:id", (req, res) => {
    return res.json(
        Judge.getById(req.paramas.id)
    );
});
const checkForDeleteOrUpdate = (id) => {
    return Class.getByKomisjaContainsId(id).length > 0;
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
        let obj = Judge.getById(req.params.id);
        if (!obj) {
            return res.status(404).send("");
        }
        Judge.remove(obj);
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
    return res.status(201).json(Judge.save(judge));
});
router.put("/", (req, res) => {
    let judgeReq = req.body;
    if (validateJudge(judgeReq)) {
        return res.status(200).json({ message: "Niepoprawne dane." });
    }
    if (checkForDeleteOrUpdate(judgeReq.$loki)) {
        return res.status(200).json({ message: "Nie możesz zaktualizować tego sędziego." });
    }
    Judge.update(judgeReq);
    return res.status(201).json(judgeReq);
});

module.exports = router;
