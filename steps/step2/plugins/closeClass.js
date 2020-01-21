const sumpoints = require("../plugins/sumpointsBackend");
const db = require("../database/db");
module.exports = {
    closeClass: (id, alreadyRated) => {
        let pointsMap = null;
        let classToOpen = db.getCollection("class").findOne({ "$loki": parseInt(id) });
        if (classToOpen.ocena === -1) {
            let anotherClassOpen = db.getCollection("class").findOne({ "ocena": 0 });
            if (anotherClassOpen) {
                return {
                    status: 200,
                    message: anotherClassOpen.numer + " " + anotherClassOpen.kat + " jest aktualnie otwarta."
                };
            }
                if (db.getCollection("horse").find({ "klasa": classToOpen.$loki }).length === 0) {
                    return {
                        status: 200,
                        message: "Ta klasa nie ma przypisanych koni."
                    };
                }
            classToOpen.ocena = 0;
        } else if (classToOpen.ocena === 1) {
            return {
                status: 200,
                message: classToOpen.numer + " " + classToOpen.kat + " została już oceniona."
            };
        } else if (classToOpen.ocena === 0) {
                let allGraded = true;
                let horsesFromClass = db.getCollection("horse").find({ "klasa": classToOpen.$loki });
                horsesFromClass.forEach(el => {
                    if (el.ocena === -1) {
                        allGraded = false;
                    }
                    el.found = false;
                });
                if (allGraded) {
                    let arbitrator = false;
                    let horseMap = [];
                    if (!alreadyRated) {
                        for (let i = 0; i < horsesFromClass.length; i++) {
                            if (!horsesFromClass[i].found) {
                                let array = [];
                                horsesFromClass[i].found = true;
                                array.push(horsesFromClass[i]);
                                for (let j = i + 1; j < horsesFromClass.length; j++) {
                                    if (sumpoints.comparePoints(horsesFromClass[i], horsesFromClass[j]) === 0 && !horsesFromClass[j].found) {
                                        horsesFromClass[j].found = true;
                                        array.push(horsesFromClass[j]);
                                    }
                                }
                                if (array.length > 1) {
                                    horseMap.push(array);
                                    arbitrator = true;
                                }
                            }
                        }
                    }
                    if (arbitrator) {
                        horseMap.forEach(el => {
                            el.forEach(el => {
                                delete el.found;
                            });
                        });
                        return {
                            status: 200,
                            horses: horseMap
                        };
                    } else {
                        classToOpen.ocena = 1;
                    }
                } else {
                    return {
                        status: 200,
                        message: "Oceń wszystkie konie."
                    };
                }
        }
        db.getCollection("class").update(classToOpen);
        db.saveDatabase();
        return {
            pointsMap: pointsMap,
            status: 201
        };
    }
};
