var request = require('sync-request');
var db = require('./postgres');
var dir = require('node-dir');
var fs = require('fs');

db.runQuerySync('SELECT * FROM sentences WHERE keywords @> ARRAY[$1]',
  ["恋する"], function (err, res) {
    console.log(err, res.length);
  });