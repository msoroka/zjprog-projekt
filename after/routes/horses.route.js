var Horses = require('../app/http/controllers/horses.controller');

module.exports = function (router) {
    router.post('/konie', Horses.createHorse);
    router.get('/konie', Horses.getHorses);
    router.get('/konie/:id', Horses.getHorse);
    router.put('/konie/:id', Horses.updateHorse);
    router.delete('/konie/:id', Horses.removeHorse);
};
