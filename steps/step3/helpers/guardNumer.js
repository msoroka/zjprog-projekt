const changeNumerAndUpdate = (database, val, nr1, nr2) => {
    database.getByNumerBetween(nr1, nr2)
        .forEach(el => {
            el.numer = el.numer + val;
            database.update(el);
        });
};
exports.changeNumerOnUpdate = (database, beforeUpdate, toUpdate) => {
    let all = database.getSortByNumerDesc();
    let lastByNumer = all[0];
    if (toUpdate.numer > lastByNumer.numer) {
        toUpdate.numer = lastByNumer.numer;
        changeNumerAndUpdate(database, -1, beforeUpdate.numer + 1, toUpdate.numer);
        database.update(toUpdate);
    } else {
        if (beforeUpdate.numer < toUpdate.numer) {
            changeNumerAndUpdate(database, -1, beforeUpdate.numer + 1, toUpdate.numer);
        } else if (beforeUpdate.numer > toUpdate.numer) {
            changeNumerAndUpdate(database, 1, toUpdate.numer, beforeUpdate.numer - 1);
        }
    }
};

exports.changeNumerOnRemove = (database, numer) => {
    database.getByNumerGreaterThan(numer)
        .forEach(el => {
            el.numer--;
            database.update(el);
        });
};

exports.changeNumerOnSave = (database, numer) => {
    let last = database.getSortByNumerDesc();
    if (numer > last[0].numer) {
        numer = last[0].numer + 1;
    } else {
        database.getByNumerGreaterOrEqualThan(numer)
            .forEach(el => {
                el.numer++;
                database.update(el);
            });
    }
    return last.length > 0 ? numer : 1;
};