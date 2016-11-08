module.exports = {
    post: function (endpoint, item, body) {

        var Client = require('node-rest-client').Client

        var client = new Client();

        var args =
            {
                data: body ,
                headers: { "Content-Type": "text/plain" }
            };

        var request = client.post(endpoint + "/rest/items/" + item, args, function (data, response) {
            console.log(data.toString('utf8'));
        });


        request.on('requestTimeout', function (req) {
            console.log('request has expired');
            request.abort();
        });

        request.on('responseTimeout', function (res) {
            console.log('response has expired');

        });

        //it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts 
        request.on('error', function (err) {
            console.log('request error', err);
        });
    },/*
    toggle: function (endpoint, item) {
        post(endpoint, item, "toggle");
    },*/
    on: function (endpoint, item) {
        this.post(endpoint, item, "100,100,100");
    },
    off: function (endpoint, item) {
        this.post(endpoint, item, "0,0,0");
    }
};