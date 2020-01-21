var Classes = require('../app/http/controllers/classes.controller');

module.exports = function (router) {
    router.post('/klasy', Classes.createClass);
    router.get('/klasy', Classes.getClasses);
    router.get('/klasy/:id', Classes.getClass);
    router.put('/klasy/:id', Classes.updateClass);
    router.delete('/klasy/:id', Classes.removeClass);
};
