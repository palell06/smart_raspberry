var config = require("./config.json");

function getItem(itemType, location)
{
    itemType = washItemType(itemType);
    location = washLocation(location);

    for (var key in config.Data.Items)
    {
        if (key.toUpperCase() === itemType.toUpperCase())
        {
            return config.Data.Items[itemType][location];
        }
    }

    return false;
}

function washItemType(itemType)
{
    itemType = itemType.toUpperCase();

    if (itemType === "LIGHTING" || itemType === "LIGHTS" || itemType === 'LIGHT')
    {
        itemType = "Lights";
    }

    return itemType;
}

function washLocation(location)
{
    var suffix = ' room';

    if (location.substr(-suffix.length) === suffix)
    {
        location = location.replace(' room', '');
    }

    return location;
}

/* Variables */
module.exports.debug = config.Data.Debug;

/* Functions */
module.exports.getItem = getItem;

/* Web */
module.exports.WebProtocol = config.Data.Web.Protocol;
module.exports.WebServer = config.Data.Web.Server;
module.exports.WebPort = config.Data.Web.Port;
module.exports.Username = config.Data.Web.Username;
module.exports.Password = config.Data.Web.Password;

/* Database */
module.exports.DatabaseProtocol = config.Data.Database.Protocol;
module.exports.DatabaseServer = config.Data.Database.Server;
module.exports.DatabasePort = config.Data.Database.Port;
module.exports.Database = config.Data.Database.Database;
module.exports.DatabaseUsername = config.Data.Database.Username;
module.exports.DatabasePassword = config.Data.Database.Password;