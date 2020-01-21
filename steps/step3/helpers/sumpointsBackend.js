const sumOfAllPoints = (horse) => {
    let sum = 0.0;
    if (horse.wynik.noty !== null) {
        horse.wynik.noty.forEach(element => {
            sum += parseFloat(element.glowa);
            sum += parseFloat(element.kloda);
            sum += parseFloat(element.nogi);
            sum += parseFloat(element.ruch);
            sum += parseFloat(element.typ);
        });
    }
    return sum;
};
const sumOfRuchPoints = (horse) => {
    let sum = 0.0;
    if (horse.wynik.noty !== null) {
        horse.wynik.noty.forEach(element => {
            sum += parseFloat(element.ruch);
        });
    }
    return sum;
};
const sumOfTypPoints = (horse) => {
    let sum = 0.0;
    if (horse.wynik.noty !== null) {
        horse.wynik.noty.forEach(element => {
            sum += parseFloat(element.typ);
        });
    }
    return sum;
};
const comparePoints = (h1, h2) => {
    if (sumOfAllPoints(h1) > sumOfAllPoints(h2)) {
        return 1;
    } else if (sumOfAllPoints(h1) === sumOfAllPoints(h2)) {
        if (sumOfTypPoints(h1) > sumOfTypPoints(h2)) {
            return 1;
        } else if (sumOfTypPoints(h1) === sumOfTypPoints(h2)) {
            if (sumOfRuchPoints(h1) > sumOfRuchPoints(h2)) {
                return 1;
            } else if (sumOfRuchPoints(h1) === sumOfRuchPoints(h2)) {
                return 0;
            }
        }
    }
    return -1;
};

module.exports = {
    sumOfAllPoints: sumOfAllPoints,
    sumOfRuchPoints: sumOfRuchPoints,
    sumOfTypPoints: sumOfTypPoints,
    comparePoints: comparePoints
};
