//import express = require('express');
import http = require('http');
import path = require('path');


var config = require('./config');
var helper = require('./helper');
var alexa = require('alexa-app');
var wolfram = require('./lib/wolfram');
var HA = require('./lib/openhab');

/*var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

import stylus = require('stylus');
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/contact', routes.contact);
app.get('/command', routes.command);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});*/

var alexaAppServer = require('alexa-app-server');
var server = new alexaAppServer({
    server_root: __dirname,
    app_dir: "apps",
    public_html : "public",
    app_root: "/api/",
    server_dir: "routes",
    port: process.env.PORT || 3000,
    debug: true,
    log: true,
    // The pre() method is called after the express server has been instantiated,
    // but before and Alexa Apps have been loaded. It is passed the AlexaAppServer 
    // object itself.
    pre: function (appServer)
    {

    },

    // The post() method is called after the server has started and the start() method 
    // is ready to exit. It is passed the AlexaAppServer object itself.
    post : function (appServer) { },

    // Like pre(), but this function is fired on every request, but before the 
    // application itself gets called. You can use this to load up user details before
    // every request, for example, and insert it into the json request itself for
    // the application to use.
    // If it returns a falsy value, the request json is not changed.
    // If it returns a non-falsy value, the request json is replaced with what was returned.
    // If it returns a Promise, request processing pauses until the Promise resolves.
    //    The value passed on by the promise (if any) replaces the request json.
    preRequest : function (json, request, response) { },

    // Like post(), but this function is fired after every request. It has a final 
    // opportunity to modify the JSON response before it is returned back to the
    // Alexa service.
    // If it returns a falsy value, the response json is not changed.
    // If it returns a non-falsy value, the response json is replaced with what was returned.
    // If it returns a Promise, response processing pauses until the Promise resolves.
    //    The value passed on by the promise (if any) replaces the response json.
    postRequest : function (json, request, response) { }

}
);

server.start();

server.express.set('views', path.join(__dirname, 'views'));
server.express.set('view engine', 'jade');
//server.express.use(server.express.favicon());
//server.express.use(server.express.logger('dev'));
//server.express.use(server.express.json());
//server.express.use(server.express.urlencoded());
//server.express.use(server.express.methodOverride());
//server.express.use(server.express.router);

//import stylus = require('stylus');
//server.express.use(stylus.middleware(path.join(__dirname, 'public')));
//server.express.use(server.express.static(path.join(__dirname, 'public')));

//import routes = require('./routes/index');
//server.express.get('/', routes.index);
//server.express.get('/about', routes.about);
//server.express.get('/contact', routes.contact);
//server.express.get('/command', routes.command);