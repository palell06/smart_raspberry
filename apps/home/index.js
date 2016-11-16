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
        var currentdate = new Date();
        var transaction = {
            "RequestId": (request.data != null && request.data.request != null) ? request.data.request.requestId : "",
            "SessionId": request.sessionId,
            "ApplicationId": request.applicationId,
            "Action": "Server",
            "UserId": request.userId,
            "Timestamp": currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds(),
            "Info": "Received request",
            "Log": "Info"
        };
        
        //db.logTransaction(transaction);

        if (config.debug === true) {
            // Log the request
            console.log(transaction.Timestamp + ' - AWS ASK: ' + transaction.ApplicationId + ' received: ' + transaction.RequestId + ' / ' + transaction.SessionId);
        }

        if (transaction.ApplicationId !== home_config.Data.ApplicationId) {
            if (config.debug === true) {
                console.log(transaction.Timestamp + ' - ERROR: Invalid application ID in request: ' + transaction.ApplicationId);
            }

            //db.logRequest(request, "Home", "Invalid applicationId", "error");

            response.fail("Invalid application ID");
        } else {
            //db.logRequest(request, "Home", "Valid applicationId", "info");
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
            "ItemName": "LITERAL",
            "Location": "LOCATION_TYPE",
            "Action": "LITERAL"
        },
        "utterances": home_config.Data.Utterances.Switch
    },
    function (request, response) {

        try {
            
            var itemType = request.slot("ItemName");
            var action = request.slot("Action");
            var location = request.slot("Location");

            if (config.debug === true) {
                console.log("Switch intent slots: Action=\"" + action + "\", ItemType=\"" + itemType + "\" Location=\"" + location + "\"");
            }

            if (itemType && location) {

               
            } else if (itemType && !location) {
                
            } else {
                //db.logRequest(request, "Switch", "Action: " + action + " ItemType: " + itemType + " Location: " + Location + ". Unable to find correct item. Please check the configuration of the home automation controller", "error");
                util.replyWith("I cannot switch that", appName, response);
                return;
            }

            if (action && itemType && location) {
                var item = config.getItem(itemType, location);

                if (item) {
                    home_automation.getState(item, function (error, state) {
                        if (error) {
                            if (config.debug === true) {
                                console.log("Unable to get the state of " + item + ": " + error.message);
                            }

                            //db.logRequest(request, "Switch", "Unable to get the state of " + item + ": " + error.message, "error");
                        }

                        var NextAction = action.toUpperCase();
                        if (state === NextAction) {
                            //db.logRequest(request, "Your " + location + " " + itemType + " is already " + action, "warning");
                            util.replyWith("Your " + location + " " + itemType + " is already " + action, appName, response);
                        }
                        else if (state !== action) {
                            if (home_automation.setState(item, NextAction)) {
                                //db.logRequest(request, "Switch", "Switching " + action + " your " + location + " " + itemType, "info");
                                util.replyWith("Switching " + action + " your " + location + " " + itemType, appName, response);
                            } else {
                                util.replyWith("I was unable to switch " + action + " the " + itemType + " in the " + location, appName, response);
                            }

                        } else {
                            //db.logRequest(request, "Switch", "I could not switch " + action + " in your " + location + " " + itemType, "error");
                            util.replyWith("I could not switch " + action + "in your " + location + " " + itemType, appName, response);
                        }
                    });
                } else {

                    util.replyWith("I could not switch " + action + "in your " + location + " " + itemType, appName, response);
                }
                
            } else if (action && itemType) {

                var item = config.getItem(itemType, "all");

                if (item) {
                    home_automation.getState(item, function (error, state) {
                        if (error) {
                            if (config.debug === true) {
                                console.log("Unable to get the state of " + item + ": " + error.message);
                            }

                            //db.logRequest(request, "Switch", "Unable to get the state of " + item + ": " + error.message, "error");
                        }

                        var NextAction = action.toUpperCase();
                        if (state === NextAction) {
                            //db.logRequest(request, "Your " + location + " " + itemType + " is already " + action, "warning");
                            util.replyWith("The " + itemType + " is already " + action, appName, response);
                        }
                        else if (state !== action) {
                            if (home_automation.setState(item, NextAction)) {
                                //db.logRequest(request, "Switch", "Switching " + action + " your " + location + " " + itemType, "info");
                                util.replyWith("Switching " + action + " " + itemType, appName, response);
                            } else {
                                util.replyWith("I was unable to switch " + action + " the " + itemType);
                            }

                        } else {
                            //db.logRequest(request, "Switch", "I could not switch " + action + " in your " + location + " " + itemType, "error");
                            util.replyWith("I could not switch " + action + + " " + itemType, appName, response);
                        }
                    });
                } else {
                    util.replyWith("I could not switch " + action + + " " + itemType, appName, response);
                }
               
            }
            else if (location) {
                //db.logRequest(request, "Switch", "I cannot currently switch your " + location + " " + itemType, "error");
                util.replyWith("I cannot currently switch your " + location + " " + itemType, appName, response);
            }
            else {
                //db.logRequest(request, "Switch", "I cannot currently switch your " + location + " " + itemType, "error");
                util.replyWith("I cannot currently switch your " + itemType, appName, response);
            }
        }
        catch (err) {
            console.log(err);
        }

        return false;
    }
);  

app.intent("SetColorIntent",
    {
        "slots":
        {
            "Location": "LOCATION_TYPE",
            "Color": "COLOR_TYPE"
        },
        "utterances": home_config.Data.Utterances.SetColor
    },
    function (request, response) {

        try {
            var color = request.slot("Color");
            var location = request.slot("Location");

            if (config.debug === true) {
                console.log("SetColor intent slots: Color=\"" + color + "\" Location=\"" + location + "\"");
            }

            if (color && location) {
                var item = helper.getItem("lights", location);
                var hsb = helper.getColor(color);

                if (item && hsb) {
                    home_automation.getState(item, function (err, state) {
                        if (err) {
                            if (config.debug) {
                                console.log("Unable to get the state of the item: "  + item);
                            }
                        }
                        else {
                            if (state === hsb) {
                                util.replyWith("Your " + location + " lights color is already " + color, appName, response);
                            } else if (state !== hsb) {
                                if (home_automation.setState(item, hsb)) {
                                    util.replyWith("Setting your " + location + " lights color to " + color, appName, response);
                                } else {
                                    util.replyWith("I was unable to the set " + location + " lights color to " + color, appName, response);
                                }
                                
                            }
                        }
                    });
                } else if (!item && hsb) {
                    util.replyWith("I cannot set the lights color of the " + location + " to " + color, appName, response);
                } else if (!item && !hsb) {
                    util.replyWith("I cannot set that color", appName, response);
                } else if (item && !hsb) {
                    util.replyWith("I cannot set that color", appName, response);
                }

            } else if (color && !location) {
                var item = helper.getItem("lights", "all");
                var hsb = helper.getColor(color);

                if (item && hsb) {
                    home_automation.getState(item, function (err, state) {
                        if (err) {
                            if (config.debug) {
                                console.log("Unable to get the state of the item: " + item);
                            }
                        }
                        else {
                            if (state === hsb) {
                                util.replyWith("The house`s lights is already " + color, appName, response);
                            } else if (state !== hsb) {
                                if (home_automation.setState(item, hsb)) {
                                    util.replyWith("Setting lights color to " + color, appName, response);
                                } else {
                                    util.replyWith("I was unable to set the lights color to " + color, appName, response);
                                }
                                
                            }
                        }
                    });
                } else if (!item && hsb) {
                    util.replyWith("I cannot set the lights color of the house to " + color, appName, response);
                } else if (!item && !hsb) {
                    util.replyWith("I cannot set that color", appName, response);
                } else if (item && !hsb) {
                    util.replyWith("I cannot set that color", appName, response);
                }
                
            } else {
                util.replyWith("I cannot set that color", appName, response);
            }
        }
        catch (err) {
            console.log(err);
        }
        
        return false;
    });

app.intent("SetDimIntent",
    {
        "slots":
        {
            "Percent": "NUMBER",
            "ItemName": "LITERAL",
            "Location": "LOCATION_TYPE"
        },
        "utterances": home_config.Data.Utterances.SetDim
    }, function (request, response) {

        try {
            var percent = request.slot('Percent');
            var itemType = request.slot('ItemName');
            var location = request.slot('Location');

            if (config.debug) {
                console.log("SetDim intent slots: Percent=\"" + percent + "\" ItemType=\"" + itemType + "\"");
            }

            if (percent && itemType && location) {

                var item = helper.getItem(itemType, location);

                if (item) {
                    home_automation.getState(item, function (err, state) {
                        if (err) {
                            if (config.debug) {
                                console.log("Unable to get the state of the item: " + item);
                            }
                        } else {
                            if (state === percent) {
                                util.replyWith("Your " + location + " " + itemType + " are already at " + percent + " percent", appName, response);
                            } else {
                                if (home_automation.setState(item, percent)) {
                                    util.replyWith("Dimming your " + location + " " + itemType + " to " + percent + " percent", appName, response);
                                } else {
                                    util.replyWith("I was unable to dim your " + location + " " + itemType + " to " + percent + " percent", appName, response);
                                }
                            }
                        }
                    });
                } else {
                    util.replyWith("I was unable to dim your " + location + " " + itemType + " to " + percent + " percent", appName, response);
                }
            }
            else if (percent && itemType) {

                var item = helper.getItem(itemType, "all");

                if (item) {
                    home_automation.getState(item, function (err, state) {
                        if (err) {
                            if (config.debug) {
                                console.log("Unable to get the state of the item: " + item);
                            }
                        } else {
                            if (state === percent) {
                                util.replyWith("Your " + itemType + " are already at " + percent + " percent", appName, response);
                            } else {
                                if (home_automation.setState(item, percent)) {
                                    util.replyWith("Dimming your " + itemType + " to " + percent + " percent", appName, response);
                                } else {
                                    util.replyWith("I was unable to dim your " + itemType + " to " + percent + " percent", appName, response);
                                }
                            }
                        }
                    });
                } else {
                    util.replyWith("I was unable to dim your " + itemType + " to " + percent + " percent", appName, response);
                }

            }
            else if (location && percent) {
                var item = helper.getItem("Lights", location);

                if (item) {
                    home_automation.getState(item, function (err, state) {
                        if (err) {
                            if (config.debug) {
                                console.log("Unable to get the state of the item: " + item);
                            }
                        } else {
                            if (state === percent) {
                                util.replyWith("Your " + location + " lights are already at " + percent + " percent", appName, response);
                            } else {
                                if (home_automation.setState(item, percent)) {
                                    util.replyWith("Dimming your " + location + " lights to " + percent + " percent", appName, response);
                                } else {
                                    util.replyWith("I was unable to dim your " + location + " lights to " + percent + " percent", appName, response);
                                }
                            }
                        }
                    });
                } else {
                    util.replyWith("I was unable to dim your " + location + " lights to " + percent + " percent", appName, response);
                }

            } else if (percent) {
                var item = helper.getItem("Lights", "all");

                if (item) {
                    home_automation.getState(item, function (err, state) {
                        if (err) {
                            if (config.debug) {
                                console.log("Unable to get the state of the item: " + item);
                            }
                        } else {
                            if (state === percent) {
                                util.replyWith("Your lights are already at " + percent + " percent", appName, response);
                            }
                            else {
                                if (home_automation.setState(item, percent)) {
                                    util.replyWith("Dimming your lights to " + percent + " percent", appName, response);
                                } else {
                                    util.replyWith("I was unable to dim your lights to " + percent + " percent", appName, response);
                                }
                            }
                        }
                    });
                } else {
                    util.replyWith("I was unable to dim your lights to " + percent + " percent", appName, response);
                }
            } else {
                util.replyWith("It seems that I am unable to do that");
            }
        }
        catch (err) {
            console.log(err);
        }
        
    });

app.intent("StopIntent",
    {
        "utterances": home_config.Data.Utterances.Stop
    }, function (request, response) {
        if (config.debug === true) {
            console.log("Stopping...");
        }
        //db.logRequest(request, "Switch", "Stopping...", "info");
        response.say("Bye").send();
    });

app.intent("CancelIntent",
    {
        "utterances": home_config.Data.Utterances.Cancel
    }, function (request, response) {
        if (config.debug === true) {
            console.log("Cancelling...");
        }
        //db.logRequest(request, "Switch", "Cancelling...", "info");
        response.say("Bye").send();
    });

app.intent("HelpIntent",
    {
        "utterances": home_config.Data.Utterances.Help
    }, function (request, response) {
        if (config.debug === true) {
            console.log("Helping...");
        }
        //db.logRequest(request, "Switch", "Helping...", "info");
        response.say(config.help.say.toString()).reprompt("What would you like to do?").shouldEndSession(false);
        response.card(appName, config.help.card.toString());
    });

module.exports = app;