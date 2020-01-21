const db = require("../database/db");
const Class = {
    get : () =>{
        return db.getCollection("class").chain().find().simplesort("numer", false).data();
    },
    getSortByNumerDesc : () => {
        return db.getCollection("class").chain().find().simplesort("numer", true).data();
    },
    getById: (id) =>{
        return db.getCollection("class").findOne({ "$loki": parseInt(id) });
    },
    getByOcena: () =>{
        return db.getCollection("class").findOne({ "ocena": 0 });
    },
    getByNumer: (id) =>{
        return db.getCollection("class").findOne({ "numer": parseInt(id) });
    },
    getByKomisjaContainsId: (id) =>{
        return db.getCollection("class").find({ "komisja": { "$contains": parseInt(id) } });
    },
    getByNumerGreaterThan: (numer) => {
        return db.getCollection("class").find({ "numer": { "$gt": numer } });
    },
    getByNumerGreaterOrEqualThan: (numer) => {
        return db.getCollection("class").find({ "numer": { "$gte": numer } });
    },
    getByNumerBetween: (nr1, nr2) => {
        return db.getCollection("class").find({ "numer": { "$between": [nr1, nr2] } });
    },
    save: (data) => {
        return db.getCollection("class").insert(data);
    },
    update: (data) => {
        db.getCollection("class").update(data);
    },
    remove: (data) => {
        db.getCollection("class").remove(data);
    }
};
module.exports = Class;