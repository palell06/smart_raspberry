var alexa = require("alexa-app");
var home_config = require("../../config/home");
var config = require("../../config/configuration");
var util = require("../../lib/AlexaUtil");
var home_automation = require("../../lib/HA_util");

module.change_code = 1;

var appName = home_config.Data.Name;

var app = new alexa.app(appName);

app.launch(function (request, response) {
    response.session("launched", "true");

    response.say(config.greeting);

    response.shouldEndSession(false, "How can I help?");
});                                          

app.sessionEnded(function (request, response)
{
    logRequest(request, "Switch", "Ending session...", "info");
    response.say("Bye...");
});

app.messages.NO_INTENT_FOUND = "I am uncertain what you mean. Kindly rephrase...";

app.pre = function (request, response, type) {
    var address = request.data.remoteAddress;
    var timestamp = request.data.request.timestamp;
    var requestId = request.data.request.requestId;
    var sessionId = request.sessionId;
    var userId = request.sessionDetails.userId;
    var applicationId = request.sessionDetails.application.applicationId;

    logRequest(request, "Home", "Received request", "info");

    if (config.debug) {
        // Log the request
        console.log(address + ' - ' + timestamp + ' - ' + ' AWS ASK ' + type + ' received: ' + requestId + ' / ' + sessionId);
    }

    if (applicationId !== switch_config.Data.applicationId) {
        if (config.debug) {
            console.log(address + ' - ' + timestamp + ' - ERROR: Invalid application ID in request:' + applicationId);
        }

        logRequest(request, "Home", "Invalid applicationId", "error");

        response.fail("Invalid application ID");
    }
};

app.intent("SwitchIntent",
    {
        "slots":
        {
            "ItemType": "LITERAL",
            "Location": "LOCATION_TYPE",
            "Action": "LITERAL"
        },
        "utterances": home_config.Data.Utterances.Switch
    },
    function (request, response) {
        var itemType = request.slot("ItemType").toUpperCase();
        var action = request.slot("Action").toUpperCase();
        var location = request.slot("Location").toUpperCase();    

        if (config.Debug) {
            console.log("Switch intent slots: Action=\"" + action + "\", ItemName=\"" + itemName + "\" Location=\"" + location + "\"");
        }

        if (itemType && location) {
            var item = config.getItem(itemType, location);
        } else {
            logRequest(request, "Switch", "Action: " + action + " ItemType: " + itemType + " Location: " + Location + ". Unable to find correct item. Please check the configuration of the home automation controller" , "error");
            util.replayWith("I cannot switch that", response);
            return;
        }

        if (action && itemType && location && item) {
            home_automation.getState(item, function (error, state) {
                if (error) {
                    if (config.debug) {
                        console.log("Unable to get the state of " + item + ": " + error.message);
                    }

                    logRequest(request, "Switch", "Unable to get the state of " + item + ": " + error.message, "error");
                }

                var NextAction = action.toUpperCase();
                if (state === NextAction) {
                    logRequest(request, "Your " + location + " " + itemType + " is already " + action, "warning");
                    util.replayWith("Your " + location + " " + itemType + " is already " + action, response);
                }
                else if (state !== action) {
                    home_automation.setState(item, NextAction);
                    logRequest(request, "Switch", "Switching " + action + " your " + location + " " + item, "info");
                    replyWith("Switching " + action + " your " + location + " " + item, response);
                } else {
                    logRequest(request, "Switch", "I could not switch " + action + " in your " + location + " " + item, "error");
                    replyWith("I could not switch " + action + "in your " + location + " " + item, response);
                }
            });
        } else {
            logRequest(request, "Switch", "I cannot currently switch your " + location + " " + item, "error");
            replyWith("I cannot currently switch your " + location + " " + item, response);
        }

        return false;
    }
);  

app.intent("StopIntent",
    {
        "utterances": home_config.Data.Utterances.Stop
    }, function (request, response) {
        if (config.debug) {
            console.log("Stopping...");
        }
        logRequest(request, "Switch", "Stopping...", "info");
        response.say("Bye").send();
    });

app.intent("CancelIntent",
    {
        "utterances": home_config.Data.Utterances.Cancel
    }, function (request, response) {
        if (config.debug) {
            console.log("Cancelling...");
        }
        logRequest(request, "Switch", "Cancelling...", "info");
        response.say("Bye").send();
    });

app.intent("HelpIntent",
    {
        "utterances": home_config.Data.Utterances.Help
    }, function (request, response) {
        if (config.debug) {
            console.log("Helping...");
        }
        logRequest(request, "Switch", "Helping...", "info");
        response.say(config.help.say.toString()).reprompt("What would you like to do?").shouldEndSession(false);
        response.card(appName, config.help.card.toString());
    });

module.exports = app;