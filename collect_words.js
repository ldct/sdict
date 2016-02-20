var db = require('./postgres.js');
var async = require('async');

var query = db.client.query('SELECT * FROM sentences LIMIT 5000000');

var processed = 0;

s = {};

query.on('error', function (err) {
  console.log('error: ', err);
});

query.on('row', function (row) {
  processed += 1;
  console.log(processed);
  row.keywords.forEach(function (keyword) {
    s[keyword] = 1;
  });
});

query.on('end', function () {
  console.log('end');
  async.eachSeries(Object.keys(s), function (item, cb) {
    db.runQuery('INSERT INTO keywords VALUES($1) ON CONFLICT DO NOTHING', [item], cb);
  }, function (err) {
    console.log(err);
  });
});
