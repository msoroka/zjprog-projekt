const db = require("../database/db");
const Horse = {
    get : () =>{
        return db.getCollection("horse").chain().find().simplesort("numer", false).data();
    },
    getSortByNumerDesc : () => {
        return db.getCollection("horse").chain().find().simplesort("numer", true).data();
    },
    getByIdArray: (array) =>{
        return db.getCollection("horse").find({ "$loki": { "$in": array } });
    },
    getByKlasa: (klasa) =>{
        return db.getCollection("horse").find({ "klasa": parseInt(klasa) });
    },
    getById: (id) =>{
        return db.getCollection("horse").findOne({ "$loki": parseInt(id) });
    },
    getByNumerGreaterThan: (numer) => {
        return db.getCollection("horse").find({ "numer": { "$gt": numer } });
    },
    getByNumerGreaterOrEqualThan: (numer) => {
        return db.getCollection("horse").find({ "numer": { "$gte": numer } });
    },
    getByNumerBetween: (nr1, nr2) => {
        return db.getCollection("horse").find({ "numer": { "$between": [nr1, nr2] } });
    },
    save: (data) => {
        return db.getCollection("horse").insert(data);
    },
    update: (data) => {
        db.getCollection("horse").update(data);
    },
    remove: (data) => {
        db.getCollection("horse").remove(data);
    }
};
module.exports = Horse;