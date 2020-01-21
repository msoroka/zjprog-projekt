const db = require("../database/db");
const db_collection = db.getCollection("judge");
const Judge = {
    get : () =>{
        return db_collection.find();
    },
    getByIdArray: (array) =>{
        return db_collection.find({ "$loki": { "$in": array } });
    },
    getById: (id) =>{
        return db_collection.findOne({ "$loki": parseInt(id) });
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
module.exports = Judge;