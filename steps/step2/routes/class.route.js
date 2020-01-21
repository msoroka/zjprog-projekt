const express = require("express");
const router = express.Router();
const Class = require("../controllers/class.controller");

router.get("/", Class.getClass);
router.get("/:id", Class.getClassById);
router.get("/:id/horses", Class.horsesFromClass);
router.delete("/:id", Class.removeClass);
router.post("/", Class.saveClass);
router.put("/:id", Class.closeClass);
router.put("/", Class.updateClass);

module.exports = router;