var request = require('sync-request');
var db = require('./postgres');
var dir = require('node-dir');
var fs = require('fs');
var mecab = require('mecab-ffi');

var uniqueArray = function (a) {
  return a.filter(function(item, pos) {
    return a.indexOf(item) == pos;
  });
}

var REJECT = ['記号', '助動詞', 'フィラー', '助詞', '感動詞', '接続助詞'];

var parseLine = function (line) {

  var keywords = mecab.parseSync(line).filter(function (entry) {
    return REJECT.indexOf(entry[1]) == -1;
  }).map(function (entry) {
    return entry[7];
  });

  return uniqueArray(keywords);

}

var recordSegmentation = function (sentence, keywords) {
  try {
    db.runQuerySync('INSERT INTO sentences(sentence, keywords) VALUES($1, $2)',
      [sentence, keywords]);
  } catch (e) {
    // console.log('error', e);
  }
}

var parseAndRecordSentence = function (sentence) {
  recordSegmentation(sentence, parseLine(sentence));
}

dir.files('.', function (err, s) {
  s.forEach(function (filename) {
    if (filename.indexOf('/') !== -1) return;
    if (filename.slice(0, 12) !== 'sentences_db') return;

    var sentenceFile = fs.readFileSync(filename, 'utf-8');
    var sentences = sentenceFile.split('\n');
    console.log('Got ' + sentences.length + ' sentences');
    var n = sentences.length;
    sentences.forEach(function (sentence, i) {
      parseAndRecordSentence(sentence);
      if (i % 100 == 0) {
        console.log('[' + filename + '] recorded ', i, '/', n);
      }
    });
  });
});