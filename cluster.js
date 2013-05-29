var config = require("./config.json");
global.config = config;
var cluster = require('ompimon-cluster');
cluster.start();