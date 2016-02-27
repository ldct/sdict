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
      return <div> {sentences.map(function (sentence) {
        return <div> {sentence} </div>
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
  render: function () {
    return <div>
      <input 
        id="searchQueryBox" 
        style={{width: "80%"}}
        onKeyUp={this.handleQueryKeyUp}
      />
      <button 
        id="search"
        onClick={this.handleSearchClick}
      >Search</button>
 
      <SearchResults searchResults = {this.state.searchResults} />

      <pre> {JSON.stringify(this.state)} </pre>

    </div>
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('container')
);

