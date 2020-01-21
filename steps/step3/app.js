const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const db = require("./database/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3001;
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/judge", require("./routes/judge.route"));
app.use("/class", require("./routes/class.route"));
app.use("/horse", require("./routes/horse.route"));
// gotowe dane z json-server
app.get("/load_data", (_req, res) => {
    db.clearDatabase();
    axios.get("http://localhost:3000/klasy")
        .then(res => {
            let data = res.data;
            data.forEach(el => {
                el.ocena = -1;// -1 nie ocena, 0 oceniana (max 1), 1 ocena
                delete el.id;
                db.getCollection("class").insert(el);
            });
        });
    axios.get("http://localhost:3000/sedziowie")
        .then(res => {
            res.data.forEach(el => {
                delete el.id;
                db.getCollection("judge").insert(el);
            });
        });
    axios.get("http://localhost:3000/konie")
        .then(res => {
            res.data.forEach(el => {
                delete el.id;
                el.ocena = -1;// -1 nie ocena, 0 oceniana (max 1), 1 ocena
                db.getCollection("horse").insert(el);
            });
        });
    return res.status(200).json({ msg: "OK" });
});

app.listen(port, () => {
    console.log("App is working " + port);
});
