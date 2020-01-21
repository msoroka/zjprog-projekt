const Loki = require("lokijs");
let db = new Loki("dev_database.json", {
    autoload: true,
    autosave: true,
    autosaveInterval: 1000,
    autoloadCallback: loadCollections
});
function loadCollections () {
    if (!db.getCollection("judge")) {
        db.addCollection("judge");
    }
    if (!db.getCollection("class")) {
        db.addCollection("class");
    }
    if (!db.getCollection("horse")) {
        db.addCollection("horse");
    }
    if (!db.getCollection("user")) {
        db.addCollection("user");
        db.getCollection("user").insert({
            username: "username",
            password: "password"
        });
    }
}
db.clearDatabase = () => {
    console.log("clearing");
    db.removeCollection("judge");
    db.removeCollection("class");
    db.removeCollection("horse");
    db.removeCollection("user");
    db.addCollection("judge");
    db.addCollection("class");
    db.addCollection("horse");
    db.addCollection("user");
    db.getCollection("user").insert({
        username: "username",
        password: "password"
    });
};
module.exports = db;
