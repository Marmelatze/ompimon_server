var config = require("./config.json");
global.config = config;
require("ompimon-client").start();