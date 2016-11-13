var config = require("../config/configuration");
var mongo = require("mongodb").MongoClient, assert = require('assert');

var url = config.DatabaseProtocol + "://" + config.DatabaseServer + ":" + config.DatabasePort + "/" + config.Database;

var logTransaction = function (transaction) {
    mongo.connect(url, function (err, db) {

        if (err) {
            if (console.debug === true) {
                console.log("Unable to login to the server: " + err);
            }

        }
        else {
            if (console.debug === true) {
                console.log("Connected successfully to " + url);
            }

            InsertTransaction(transaction, db);
        }
    });
};

var InsertTransaction = function (transaction, db) {
    
    var collection = db.collection("Transactions");
    collection.insert(transaction,
        function (err, result) {
            if (err || (result.result.n == 0) || (result.ops.length == 0)) {
                if (config.debug === true) {
                    console.log("Unable to persist transaction. Error \"" + err + "\" Object:" + transaction);
                }
            } else {
                if (config.debug === true) {
                    console.log("Successfully persisted transaction");
                }
            }
        });
};

var logRequest = function (request, applicationName, info, log) {
    var transaction = mapRequest(request, applicationName, info, log);
    logTransaction(transaction);
};

var mapRequest = function (request, action, info, log) {
    var Transaction = {
        "Request": request,
        "Action": action,
        "Info": info,
        "Log":  log
    };

    return Transaction;
};

module.exports.logTransaction = logTransaction;
module.exports.logRequest = logRequest;