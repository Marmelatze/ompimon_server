#!/bin/bash

nodeunit ./node_modules/ompimon-protocol/test/*
nodeunit ./node_modules/ompimon-cluster/test
nodeunit ./node_modules/ompimon-storage/test
