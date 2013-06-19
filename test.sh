#!/bin/bash

nodeunit ./node_modules/ompimon-protocol/test/*.js
nodeunit ./node_modules/ompimon-protocol/test/cluster/*
nodeunit ./node_modules/ompimon-protocol/test/client/*
nodeunit ./node_modules/ompimon-cluster/test
nodeunit ./node_modules/ompimon-storage/test
