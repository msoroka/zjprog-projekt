var getSumPoints = (horse) => {
    var horseTyp = 0;
    var horseGlowa = 0;
    var horseKloda = 0;
    var horseNogi = 0;
    var horseRuch = 0;
    var horseSuma = 0;
    Array.from(horse.wynik.noty).forEach(hw => {
        horseTyp += Number(hw.typ);
        horseGlowa += Number(hw.glowa);
        horseKloda += Number(hw.kloda);
        horseNogi += Number(hw.nogi);
        horseRuch += Number(hw.ruch);
    });
    horseSuma = horseTyp + horseGlowa + horseKloda + horseNogi + horseRuch;

    return horseSuma;
};

var getTypeSumPoints = (horse) => {
    var horseTyp = 0;
    Array.from(horse.wynik.noty).forEach(hw => {
        horseTyp += Number(hw.typ);
    });

    return horseTyp;
};

var getMoveSumPoints = (horse) => {
    var horseRuch = 0;
    Array.from(horse.wynik.noty).forEach(hw => {
        horseRuch += Number(hw.ruch);
    });

    return horseRuch;
};
var compare = (a, b) => {
    if (a.klasa === b.klasa) {
        if (getSumPoints(a) > getSumPoints(b)) {
            return -1;
        } else if (getSumPoints(a) < getSumPoints(b)) {
            return 1;
        } else {
            if (getTypeSumPoints(a) > getTypeSumPoints(b)) {
                return -1;
            } else if (getTypeSumPoints(a) < getTypeSumPoints(b)) {
                return 1;
            } else {
                if (getMoveSumPoints(a) > getMoveSumPoints(b)) {
                    return -1;
                } else if (getMoveSumPoints(a) < getMoveSumPoints(b)) {
                    return 1;
                } else {
                    if (a.wynik.rozjemca < b.wynik.rozjemca) {
                        return -1;
                    } else if (a.wynik.rozjemca > b.wynik.rozjemca) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            }
        }
    }
};

module.exports = compare;
