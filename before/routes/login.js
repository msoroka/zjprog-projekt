const express = require("express");
const router = express.Router();
const db = require("../database/db");
const jwt = require("jsonwebtoken");
const secret = "secret";
router.post("/", (req, res) => {
    let user = req.body;
    let userDb = db.getCollection("user").findOne({ "username": user.username });
    if (!userDb) {
        return res.status(200).json({
            message: "Nie ma takiego konta."
        });
    }
    if (userDb.username === user.username && userDb.password === user.password) {
        jwt.sign({
            username: user.username
        }, secret, { expiresIn: 36000 },
        (err, token) => {
            if (err) {
                return res.status(500).json({
                    message: "Wystąpił błąd."
                });
            }
            return res.status(200).json({
                success: true,
                token: token
            });
        });
    } else {
        return res.status(200).json({
            message: "Login lub hasło nie pasuje."
        });
    }
});

module.exports = router;
