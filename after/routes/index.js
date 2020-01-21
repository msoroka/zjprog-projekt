var judgesRoutes = require('./judges.route');
var classesRoutes = require('./classes.route');
var horsesRoutes = require('./horses.route');

var routes = function (router) {
    judgesRoutes(router);
    classesRoutes(router);
    horsesRoutes(router);
};

module.exports = routes;
