var db = require('./postgres.js');

var query = db.client.query('SELECT * FROM sentences');

var processed = 0;

s = new Set();

query.on('error', function (err) {
  console.log('error: ', err);
});

query.on('row', function (row) {
  processed += 1;
  console.log(processed, s.size);
  row.keywords.forEach(function (keyword) {
    s.add(keyword);
  });
});

query.on('end', function () {
  console.log('end');
  // console.log(s);
});
