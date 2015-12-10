var db = require('./postgres');
var dir = require('node-dir');
var fs = require('fs');

var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');
var async = require('async');

app.use(cors());
app.use(bodyParser.json({ 'limit': '10mb' }));
app.use(morgan('dev'));

app.use(express.static('static'));

app.get('/sentences/:keyword', function (req, res) {
  var keyword = req.params.keyword;
  db.runQuerySync('SELECT * FROM sentences WHERE keywords @> ARRAY[$1]',
    [keyword], function (err, rows) {
      return res.json(rows);
    });
});

var port = +process.argv[2] || 3000;
server.listen(port, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('sdict listening at http://%s:%s', host, port);

});

db.runQuerySync('SELECT * FROM sentences WHERE keywords @> ARRAY[$1]',
  ["恋する"], function (err, res) {
    console.log(err, res.length);
  });
