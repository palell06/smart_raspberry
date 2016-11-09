var config = require("./config");

function getItem(itemType, location)
{
    itemType = washItemType(itemType);
    location = washLocation(location);

    for (var key in config.Data.Items)
    {
        if (config.Data.Items.hasOwnProperty(itemType))
        {
            return config.item[itemType][location];
        }
    }

    return false;
}

function washItemType(itemType)
{
    if (itemType === "lighting" || itemType === "lights")
    {
        itemType = "light";
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