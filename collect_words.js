var db = require('./postgres.js');
var async = require('async');

var query = db.client.query('SELECT * FROM sentences LIMIT 5000');

var processed = 0;

s = {};

query.on('error', function (err) {
  console.log('error: ', err);
});

query.on('row', function (row) {
  processed += 1;
  if (processed < 1000000000000) {
    console.log(processed, row.sentence);
  }
  row.keywords.forEach(function (keyword) {
    s[keyword] = 1;
  });
});

query.on('end', function () {
  console.log('end');
  async.eachSeries(Object.keys(s), function (item, cb) {
    console.log(item);
    db.runQuery('INSERT INTO keywords VALUES($1) ON CONFLICT DO NOTHING', [item], cb);
  }, function (err) {
    if (err) return console.log(err);
    console.log('done inserting all keywords');
    process.exit();
  });
});
