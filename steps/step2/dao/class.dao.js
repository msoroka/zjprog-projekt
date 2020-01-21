const db = require("../database/db");
const db_collection = db.getCollection("class");
const Class = {
    get : () =>{
        return db_collection.chain().find().simplesort("numer", false).data();
    },
    getSortByNumerDesc : () => {
        return db_collection.chain().find().simplesort("numer", true).data();
    },
    getById: (id) =>{
        return db_collection.findOne({ "$loki": parseInt(id) });
    },
    getByOcena: () =>{
        return db_collection.findOne({ "ocena": 0 });
    },
    getByNumer: (id) =>{
        return db_collection.findOne({ "numer": parseInt(id) });
    },
    getByKomisjaContainsId: (id) =>{
        return db_collection.find({ "komisja": { "$contains": parseInt(id) } });
    },
    getByNumerGreaterThan: (numer) => {
        return db_collection.find({ "numer": { "$gt": numer } });
    },
    getByNumerGreaterOrEqualThan: (numer) => {
        return db_collection.find({ "numer": { "$gte": numer } });
    },
    getByNumerBetween: (nr1, nr2) => {
        return db_collection.find({ "numer": { "$between": [nr1, nr2] } });
    },
    save: (data) => {
        return db_collection.insert(data);
    },
    update: (data) => {
        db_collection.update(data);
    },
    remove: (data) => {
        db_collection.remove(data);
    }
};
module.exports = Class;