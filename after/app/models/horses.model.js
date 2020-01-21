var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var horsesSchema = new Schema({
    numer: {
        type: Number,
        required: true
    },
    klasa: {
        type: Number,
        required: true
    },
    nazwa: {
        type: String,
        required: true
    },
    kraj: {
        type: String,
        required: true
    },
    rocznik: {
        type: String,
        required: true
    },
    masc: {
        type: String,
        required: true
    },
    plec: {
        type: String,
        required: true
    },
    hodowca: {
        nazwa: {
            type: String,
            required: true
        },
        kraj: {
            type: String,
            required: true
        }
    },
    wlasciciel: {
        nazwa: {
            type: String,
            required: true
        },
        kraj: {
            type: String,
            required: true
        }
    },
    rodowod: {
        o: {
            nazwa: {
                type: String,
                required: true
            },
            kraj: {
                type: String,
                required: true
            }
        },
        m: {
            nazwa: {
                type: String,
                required: true
            },
            kraj: {
                type: String,
                required: true
            }
        },
        om: {
            nazwa: {
                type: String,
                required: true
            },
            kraj: {
                type: String,
                required: true
            }
        }
    },
    wynik: {
        required: false,
        rozjemca: {
            type: Number,
            default: 0
        },
        noty: {
            type: [{
                typ: {
                    type: Number,
                    default: 0
                },
                glowa: {
                    type: Number,
                    default: 0
                },
                kloda: {
                    type: Number,
                    default: 0
                },
                nogi: {
                    type: Number,
                    default: 0
                },
                ruch: {
                    type: Number,
                    default: 0
                }
            }]
        }
    }
});

module.exports = horsesSchema;
