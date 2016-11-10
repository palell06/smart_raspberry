var config = require("./config/configuration");
var itemType = "lights";
var location = "living room";
var item = config.getItem(itemType, location);
var home_automation = require("./lib/HA_Util");

home_automation.getState(item, function (error, state) {
    if (error) {
        console.log("Unable to get the state of " + item + ": " + error.message);
    }
    var action = "50,0,70";

    if (state === action) {
        console.log("Your " + location + " " + itemType + " is already " + action);
    }
    else if (state !== action) {
        home_automation.setState(item, action);
        console.log("Switching " + action + " your " + location + " " + item);
    } else {
        console.log("I could not switch " + action + " your " + location + " " + item);
    }
});



var AlexaAppServer = require('alexa-app-server');
AlexaAppServer.start({
    server_root: __dirname,
    public_html: "public_html",
    app_dir: "apps",
    app_root: "/api/",
    port: process.env.PORT || 3000,
    debug: true,
    log: true,
    // The pre() method is called after the express server has been instantiated,
    // but before and Alexa Apps have been loaded. It is passed the AlexaAppServer 
    // object itself.
    pre: function (appServer) {
    },
    // The post() method is called after the server has started and the start() method 
    // is ready to exit. It is passed the AlexaAppServer object itself.
    post: function (appServer) { },
    // Like pre(), but this function is fired on every request, but before the 
    // application itself gets called. You can use this to load up user details before
    // every request, for example, and insert it into the json request itself for
    // the application to use.
    // If it returns a falsy value, the request json is not changed.
    // If it returns a non-falsy value, the request json is replaced with what was returned.
    // If it returns a Promise, request processing pauses until the Promise resolves.
    //    The value passed on by the promise (if any) replaces the request json.
    preRequest: function (json, request, response) { },
    // Like post(), but this function is fired after every request. It has a final 
    // opportunity to modify the JSON response before it is returned back to the
    // Alexa service.
    // If it returns a falsy value, the response json is not changed.
    // If it returns a non-falsy value, the response json is replaced with what was returned.
    // If it returns a Promise, response processing pauses until the Promise resolves.
    //    The value passed on by the promise (if any) replaces the response json.
    postRequest: function (json, request, response) { }
});
