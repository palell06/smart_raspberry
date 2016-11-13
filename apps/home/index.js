var alexa = require("alexa-app");
var home_config = require("../../config/home");
var config = require("../../config/configuration");
var util = require("../../lib/AlexaUtil");
var home_automation = require("../../lib/HA_Util");
var db = require("../../lib/Db");

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
    db.logRequest(request, "Switch", "Ending session...", "info");
    response.say("Bye...");
});

app.messages.NO_INTENT_FOUND = "I am uncertain what you mean. Kindly rephrase...";

app.pre = function (request, response, type) {

    try {
        var transaction = db.logRequest(request, "Home", "Received request", "info");

        if (config.debug === true) {
            // Log the request
            console.log(transaction.Timestamp + ' - AWS ASK: ' + transaction.ApplicationId + ' received: ' + transaction.RequestId + ' / ' + transaction.SessionId);
        }

        if (transaction.ApplicationId !== home_config.Data.ApplicationId) {
            if (config.debug === true) {
                console.log(transaction.Timestamp + ' - ERROR: Invalid application ID in request: ' + transaction.ApplicationId);
            }

            db.logRequest(request, "Home", "Invalid applicationId", "error");

            response.fail("Invalid application ID");
        } else {
            db.logRequest(request, "Home", "Valid applicationId", "info");
        }
    }
    catch (err) {
        console.log(err);
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

        try {
            var itemType = request.slot("ItemType");
            var action = request.slot("Action");
            var location = request.slot("Location");

            if (config.debug === true) {
                console.log("Switch intent slots: Action=\"" + action + "\", ItemType=\"" + itemType + "\" Location=\"" + location + "\"");
            }

            if (itemType && location) {
                var item = config.getItem(itemType, location);
            } else {
                db.logRequest(request, "Switch", "Action: " + action + " ItemType: " + itemType + " Location: " + Location + ". Unable to find correct item. Please check the configuration of the home automation controller", "error");
                util.replyWith("I cannot switch that", appName, response);
                return;
            }

            if (action && itemType && location && item) {
                home_automation.getState(item, function (error, state) {
                    if (error) {
                        if (config.debug === true) {
                            console.log("Unable to get the state of " + item + ": " + error.message);
                        }

                        db.logRequest(request, "Switch", "Unable to get the state of " + item + ": " + error.message, "error");
                    }

                    var NextAction = action.toUpperCase();
                    if (state === NextAction) {
                        db.logRequest(request, "Your " + location + " " + itemType + " is already " + action, "warning");
                        util.replyWith("Your " + location + " " + itemType + " is already " + action, appName, response);
                    }
                    else if (state !== action) {
                        home_automation.setState(item, NextAction);
                        db.logRequest(request, "Switch", "Switching " + action + " your " + location + " " + itemType, "info");
                        util.replyWith("Switching " + action + " your " + location + " " + itemType, appName, response);
                    } else {
                        db.logRequest(request, "Switch", "I could not switch " + action + " in your " + location + " " + itemType, "error");
                        util.replyWith("I could not switch " + action + "in your " + location + " " + itemType, appName, response);
                    }
                });
            } else {
                db.logRequest(request, "Switch", "I cannot currently switch your " + location + " " + itemType, "error");
                util.replyWith("I cannot currently switch your " + location + " " + itemType, appName, response);
            }
        }
        catch (err) {
            console.log(err);
        }



        return false;
    }
);  

app.intent("StopIntent",
    {
        "utterances": home_config.Data.Utterances.Stop
    }, function (request, response) {
        if (config.debug === true) {
            console.log("Stopping...");
        }
        db.logRequest(request, "Switch", "Stopping...", "info");
        response.say("Bye").send();
    });

app.intent("CancelIntent",
    {
        "utterances": home_config.Data.Utterances.Cancel
    }, function (request, response) {
        if (config.debug === true) {
            console.log("Cancelling...");
        }
        db.logRequest(request, "Switch", "Cancelling...", "info");
        response.say("Bye").send();
    });

app.intent("HelpIntent",
    {
        "utterances": home_config.Data.Utterances.Help
    }, function (request, response) {
        if (config.debug === true) {
            console.log("Helping...");
        }
        db.logRequest(request, "Switch", "Helping...", "info");
        response.say(config.help.say.toString()).reprompt("What would you like to do?").shouldEndSession(false);
        response.card(appName, config.help.card.toString());
    });

module.exports = app;