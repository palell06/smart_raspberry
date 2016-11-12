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

module.exports.getItem = getItem;
module.exports.debug = config.Data.Debug;
module.exports.protocol = config.Data.Protocol;
module.exports.server = config.Data.Server;
module.exports.HA_port = config.Data.HA_port;