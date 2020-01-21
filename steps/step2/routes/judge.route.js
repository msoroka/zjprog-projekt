const express = require("express");
const router = express.Router();
const Judge = require("../controllers/judge.controller");
router.get("/", Judge.getJudge);
router.get("/:id", Judge.getJudgeById);
router.delete("/:id", Judge.removeJudge);
router.post("/", Judge.saveJudge);
router.put("/", Judge.updateJudge);

module.exports = router;