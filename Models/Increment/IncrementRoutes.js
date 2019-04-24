const Controller = require('../../Controllers');

function IncrementRoute(controller) {
    this.controller = controller;
}

IncrementRoute.prototype.getRoutes = function(request, reply) {
    return [];
}

module.exports = {
    'increment': new IncrementRoute(Controller.makeModule.increment)
};