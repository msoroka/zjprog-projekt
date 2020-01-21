const Judge = require("../dao/judge.dao");
const Class = require("../dao/class.dao");
const checkForDeleteOrUpdate = (id) => {
    return Class.getByKomisjaContainsId(id).length > 0;
};
exports.getJudge = (req, res) => {
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
};

exports.getJudgeById = (req, res) => {
    return res.json(
        Judge.getById(req.paramas.id)
    );
};

exports.removeJudge = (req, res) => {
    if (checkForDeleteOrUpdate(req.params.id)) {
        return res.status(200).json({
            message: "Nie możesz usunąć tego sędziego."
        });
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
};

exports.saveJudge = (req, res) => {
    let judge = req.body;
    return res.status(201).json(Judge.save(judge));
};

exports.updateJudge = (req, res) => {
    let judgeReq = req.body;
    if (checkForDeleteOrUpdate(judgeReq.$loki)) {
        return res.status(200).json({
            message: "Nie możesz zaktualizować tego sędziego."
        });
    }
    Judge.update(judgeReq);
    return res.status(201).json(judgeReq);
};