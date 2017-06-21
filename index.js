'use strict';

var RedisClient       = require('./client');
var ClusterClient     = require('./client/cluster');

exports.RedisClient   = RedisClient;
exports.ClusterClient = ClusterClient;
