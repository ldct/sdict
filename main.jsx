// main.js
var React = require('react');
var ReactDOM = require('react-dom');

var SearchResults = React.createClass({
  render: function () {
    var searchResults = this.props.searchResults;
    if (searchResults === null || searchResults === undefined) {
      return null;
    } else if (searchResults.length && searchResults.length === 0) {
      return <div> No Results </div>
    } else {
      var sentences = this.props.searchResults.map(function (result) {
        return result.sentence;
      });
      return <div> {sentences.map(function (sentence, i) {
        return <div key={i}> {sentence} </div>
      })} </div>
    }
  }
});

var App = React.createClass({
  getInitialState: function () {
    return {
      searchTerm: ''
    }
  },
  handleQueryKeyUp: function (e) {
    e.persist();
    this.setState({
      searchTerm: e.target.value,
    });
  },
  handleSearchClick: function () {
    var self = this;
    $.get('/sentences/' + self.state.searchTerm, function (res, err) {
      if (err) console.log('error', err);
      console.log(res);
      self.setState({
        searchResults: res
      }); 
    });
    console.log('click');
  },
  handleRandomKeywordClick: function () {
    var self = this;
    $.get('/random-keyword', function (res, err) {
      $(self.refs.searchQueryBox).val(res);
      self.setState({
        searchTerm: res
      }, function () {
        $(self.refs.searchButton).click();
      });
    });
  },
  render: function () {
    return <div>
      <input 
        id="searchQueryBox" 
        ref="searchQueryBox"
        style={{width: "80%"}}
        defaultValue={this.state.searchTerm}
        onKeyUp={this.handleQueryKeyUp}
      />
      <button 
        id="search"
        ref="searchButton"
        onClick={this.handleSearchClick}
      >Search</button>
      <button
        id="random-keyword"
        onClick={this.handleRandomKeywordClick}
      >Random</button> 
      <SearchResults searchResults = {this.state.searchResults} />

      <pre> {JSON.stringify(this.state)} </pre>

    </div>
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('container')
);

