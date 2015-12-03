var assert = require('assert');
var fs = require('fs');
var dir = require('node-dir');

var SENTENCE_ENDING_PUNCTUATION = ['。', '？', '！', '.', '?', '!'];
var STOP_CHAR = SENTENCE_ENDING_PUNCTUATION.concat(['\n']);
var QUOTE_ENDING_PUNCTUATION = ['”', "'", '"', '」']; //not exhaustive
var NON_SENTENCE_ENDING_STRINGS = ['Mr.', 'Mrs.'];

var contains = function (arr, e) {
  return arr.indexOf(e) !== -1;
}

var isSameArray = function (a1, a2) {
  return JSON.stringify(a1) === JSON.stringify(a2);
}

split = function(text, start_at) {

  var ret = [];

  var i = start_at || 0;

  if (start_at > text.length) return [];

  while (!contains(STOP_CHAR, text[i]) && i < text.length) i++;
  if (i === text.length) return [text];
  if (text[i] === '\n') return [text.slice(0, i+1)].concat(split(text.slice(i+1)));
  if (contains(QUOTE_ENDING_PUNCTUATION, text[i+1])) return [text.slice(0, i+2)].concat(split(text.slice(i+2)));
  for (var j=0; j<NON_SENTENCE_ENDING_STRINGS.length; j++) {
    var nses = NON_SENTENCE_ENDING_STRINGS[j];
    var ts = text.slice(i-nses.length+1, i+1);
    if (ts === nses) return split(text, i+1);
  }
  return [text.slice(0, i+1)].concat(split(text.slice(i+1)));

}

var invert = function (fn) {
  return function (x) {
    return !fn(x);
  }
}

var isEmptyChar = function (chr) {
  return chr == '\r' || chr == '\n';
}

var isEmptySentence = function (sentence) {
  return sentence.length === 0;
}

var removeEmptyChars = function (sentence) {
  return sentence.split('').filter(invert(isEmptyChar)).join('');
}

var isQuote = function (word) {
  return word == '「' || word == '」';
}

var removeQuotes = function (sentence) {
  return sentence.split('').filter(invert(isQuote)).join('');
}

var cleanSentence = function (sentence) {
  return removeQuotes(removeEmptyChars(sentence)).trim();
}

var cleanup = function (sentences) {
  return sentences.map(cleanSentence).filter(invert(isEmptySentence));
}

var writeSentence = function (sentence, idx) {
  var shard = idx % 50;
  fs.appendFileSync('sentences_db.' + shard, sentence + '\n');
}

var extractSentences = function (filename, idx) {
  var text = fs.readFileSync(filename, 'utf-8');
  text.split('\n').forEach(function (line) {
    cleanup(split(line)).forEach(function (x) { writeSentence(x, idx) });
  });
}

dir.files('noruby', function (err, s) {
  s.forEach(function (s, i) {
    console.log(i, s);
    if (i <= 2985) return;
    if (i <= 3352) return;
    if (i <= 4879) return;
    extractSentences(s, i);
  });
});
