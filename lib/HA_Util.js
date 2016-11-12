var config = require("../config/configuration");
var request = require("request");

var setState = function (itemName, state) {

    var url = config.WebProtocol + "://" + config.WebServer + ":" + config.WebPort + "/rest/items/" + itemName;
    request.post(
        {
            uri: url,
            headers: {
                "Content-Type": "text/plain",
                "Content-Length": state.length
            },
            body: state
        },
        function (error, response) {
            if (error) {
                if (config.debug) {
                    console.log("There was an error during trying to set state: " + error.message);
                }

                return false;
            } else if (response.statusCode !== 200) {
                if (config.debug) {
                    console.log("There was an error during trying to set state. HTTP status-code: " + response.statusCode);
                }

                return false;
            } else {
                if (config.debug) {
                    console.log("Successfully posted data to\nurl: " + url);
                }

                return true;
            }
        }
    );
};

var getState = function (itemName, callback) {
    var url = config.WebProtocol + "://" + config.WebServer + ":" + config.WebPort + "/rest/items/" + itemName + "/state";
    request({
        uri: url,
        method: "GET"
        }, function (error, response) {
            if (error) {
                callback(new Error("Cannot reach the home automation controller at " + url));
            } else if (response.statusCode !== 200) {
                callback(new Error("Unable to reach the item data through " + url + ": HTTP Status-code " + response.statusCode));
            } else {
                callback(null, response.body);
            }
        });
};

module.exports.getState = getState;
module.exports.setState = setState;