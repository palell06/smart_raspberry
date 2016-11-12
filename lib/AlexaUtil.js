var config = require("../config/configuration");

function replyWith(speechOutput, appName, response) {

    if (config.debug === true) {
        console.log("response: " + speechOutput);
    }

    //'say' the response on the ECHO
    response.say(speechOutput);
    //Show a 'Card' in the Alexa app
    response.card(appName, speechOutput);

    //if this is a launch request, do not end session and handle multiple commands
    if (response.session("launched") === "true") {
        response.shouldEndSession(false);
    }

    // 'Send' the response to end upstream asynchronous requestsd
    response.send();
}

module.exports.replyWith = replyWith;