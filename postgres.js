var pg = require('pg');
var deasync = require('deasync');
var process = require('process');

var connectionString = 'postgresql://postgres@localhost/sdict';
var client = new pg.Client(connectionString);
client.connect(function (err) {
  if (err) {
    console.error('could not connect to postgres', err);
    process.exit(1);
  }
  console.log('PSQL is running');
});

exports.runQuery = function(query, args, cb) {
  var query = client.query(query, args);
  var ret = [];
  query.on('error', function(err) {
    cb(err);
  });
  query.on('row', function(row) {
    ret.push(row);
  });
  query.on('end', function() {
    cb(null, ret);
  });
}

exports.runQuerySync = deasync(exports.runQuery);

function runCommand(query) {
  exports.runQuery(query, [], function(err, res) {
    if (err) console.log(err);
  });
}

var fs = require('fs');

// var init_script = fs.readFileSync('./init.sql', 'utf8');
// runCommand(init_script);