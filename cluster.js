var config = require("./config.json");
globals.config = config;
var cluster = require('ompimon-cluster');
cluster.start();