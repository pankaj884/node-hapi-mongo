'use strict';

const preResponse = function(request, h) {

    return h.continue;

    const response = request.response;
    if (!response.isBoom) {
        return h.continue;
    }
    const error = response;
    const ctx = {
        message: (error.output.statusCode === 404 ? 'page not found' : 'something went wrong')
    };

    return h.view('error', ctx).code(error.output.statusCode);
};

const preHandler = function(request, h) {

    const path = request.method.toUpperCase() + " : " + request.url.pathname;
    console.log("********* api *****************",path);

    return h.continue;
};


const plugin = {
    name: 'ApiHistoryPlugin',
    register: function(server, options) {
        (async() => {
            await server.ext('onPreHandler', preHandler);
        })();
    }
}

module.exports = plugin