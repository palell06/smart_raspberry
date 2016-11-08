var alexa = require("alexa-app");
var config = require("../../config/switch");
var _switch = require("../../lib/switch");

module.change_code = 1;
var appName = "switch";

var app = new alexa.app(appName);
app.launch(function (request, response) {
    response.session("launched", "true");

    response.say(config.greeting);

    response.shouldEndSession(false, "Okay");
});                                          

app.sessionEnded(function (request, response)
{

});

app.messages.NO_INTENT_FOUND = "I am uncertain what you mean. Kindly rephrase...";

app.pre = function (request, response, type) {
    var address = request.data.remoteAddress;
    var password = request.data.password;
    var timestamp = request.data.request.timestamp;
    var requestId = request.data.request.requestId;
    var sessionId = request.sessionId;
    var userId = request.sessionDetails.userId;
    var applicationId = request.sessionDetails.application.applicationId;

    // Log the request
    console.log(address + ' - ' + timestamp + ' - ' + ' AWS ASK ' + type + ' received: ' + requestId + ' / ' + sessionId);

    if (applicationId !== config.applicationId) {
        console.log(address + ' - ' + timestamp + ' - ERROR: Invalid application ID in request:' + applicationId);
        response.fail("Invalid application ID");
    }
    if (userId !== config.userId) {
        console.log(address + ' - ' + timestamp + ' - ERROR: Invalid userId in request: ' + userId);
        response.fail("Invalid user ID");
    }
    if (password !== config.password) {
        console.log(address + ' - ' + timestamp + ' - ERROR: Invalid password in request: ' + password);
        response.fail("Invalid password");
    }
};

app.intent("switch",
    {
        "slots":
        {
            "Item": "LITERAL",
            "Location": "LOCATION_TYPE",
            "Action": "LITERAL"
        },
        "utterances": config.utterances
    },
    function (request, response)
    {
        var itemName = request.slot("ItemName").toUpperCase();
        var action = request.slot("Action").toUpperCase();
        var location = request.slot("Location").toUpperCase();

        if (config.Debug) 
        {
            console.log("Switch intent slots: Action=\"" + action + "\", ItemName=\"" + itemName + "\" Location=\"" + location + "\""); 
        }

        if (location != null && ValidateLocation(location)) {

        }

        if (itemName != null && ValidateItem()
        {
            
        }

    }
);  