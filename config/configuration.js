var config = require("./config.json");

function getItem(itemType, location)
{
    itemType = washItemType(itemType);
    location = washLocation(location);
    console.log(config);

    for (var key in config.Data.Items)
    {
        console.log(key.toUpperCase());
        console.log(itemType.toUpperCase());
        if (key.toUpperCase() === itemType.toUpperCase())
        {
            return config.Data.Items[itemType][location];
        }
    }
    console.log(location);
    console.log(itemType);

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