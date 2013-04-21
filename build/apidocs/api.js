YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Ompimon.Backend.User.User",
        "Ompimon.Protocol.Action.Action",
        "Ompimon.Protocol.Action.Data",
        "Ompimon.Protocol.Action.DataRequest"
    ],
    "modules": [
        "ompimon",
        "ompimon-backend",
        "ompimon-protocol"
    ],
    "allModules": [
        {
            "displayName": "ompimon",
            "name": "ompimon"
        },
        {
            "displayName": "ompimon-backend",
            "name": "ompimon-backend",
            "description": "Manage Users"
        },
        {
            "displayName": "ompimon-protocol",
            "name": "ompimon-protocol",
            "description": "Protocol Module handles incomming requests"
        }
    ]
} };
});