const db = require("../database/db");
const Judge = {
    get : () =>{
        return db.getCollection("judge").find();
    },
    getByIdArray: (array) =>{
        return db.getCollection("judge").find({ "$loki": { "$in": array } });
    },
    getById: (id) =>{
        return db.getCollection("judge").findOne({ "$loki": parseInt(id) });
    },
    save: (data) => {
        return db.getCollection("judge").insert(data);
    },
    update: (data) => {
        db.getCollection("judge").update(data);
    },
    remove: (data) => {
        db.getCollection("judge").remove(data);
    }
};
module.exports = Judge;