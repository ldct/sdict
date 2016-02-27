// main.js
var React = require('react');
var ReactDOM = require('react-dom');

var AutocompleteEntry = React.createClass({
  getInitialState: function () {
    return {hover: false};
  },
  handleMouseOver: function () {
    this.setState({hover: true});
  },
  handleMouseOut: function () {
    this.setState({hover: false});
  },
  render: function () {
    return <div 
      style={{
        backgroundColor: this.state.hover ? 'lightgrey' : 'transparent',
        width: "100%"
      }}
      onMouseOver={this.handleMouseOver}
      onMouseOut={this.handleMouseOut}
      onClick={this.props.onClick}
    > {this.props.term} </div>
  }
});

var AutocompleteResults = React.createClass({
  handleSelect: function (res) {
    this.props.onSelectResult(res);
  },
  render: function () {
    var autocompleteResults = this.props.autocompleteResults;
    if (!autocompleteResults || autocompleteResults.length === 0) {
      return null;
    } else {
      var self = this;
      return <div style={{
        border: '1px solid lightgrey',
        marginBottom: '1px'
      }}> { autocompleteResults.map(function (res) {
        return <AutocompleteEntry
          key={res}
          term={res}
          onClick={self.handleSelect.bind(self, res)}
        />
      })} </div>
    }
  }
});

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
      return <div> 
        <pre>{sentences.length} results</pre>
        {sentences.map(function (sentence, i) {
          return <div key={i}> {sentence} </div>
        })} 
      </div>
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
    this.handleQueryEntered(e.target.value);
  },
  handleQueryEntered: function (query) {
    this.setState({
      searchTerm: query,
    });
    var self = this;
    $.get('/autocomplete/' + query, function (res, err) {
      console.log(res);
      if (res.prefix === self.state.searchTerm) {
        self.setState({
          autocompleteResults: res.results
        });
      }
    });
  },
  handleSearchClick: function () {
    var self = this;
    $.get('/sentences/' + self.state.searchTerm, function (res, err) {
      if (err !== 'success') console.log('error', err);
      self.setState({
        searchResults: res
      }); 
    });
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
  handleSelectAutocompleteResult: function (result) {
    var self = this;
    $(self.refs.searchQueryBox).val(result);
    self.setState({
      searchTerm: result,
      autocompleteResults: []
    }, function () {
      $(self.refs.searchButton).click();
    });
  },
  render: function () {
    var buttonStyle = {
      marginLeft: 5,
    };
    return <div>
      <div style={{width: "80%", display: "inline-block"}}>
        <input 
          id="searchQueryBox" 
          ref="searchQueryBox"
          style={{width: "100%"}}
          defaultValue={this.state.searchTerm}
          onKeyUp={this.handleQueryKeyUp}
        />
        <AutocompleteResults
        autocompleteResults = {this.state.autocompleteResults}
        onSelectResult = {this.handleSelectAutocompleteResult} />
      </div>
      <button 
        style={buttonStyle}
        ref="searchButton"
        disabled={this.state.searchTerm.length === 0}
        onClick={this.handleSearchClick}
      >Search</button>
      <button
        style={buttonStyle}
        onClick={this.handleRandomKeywordClick}
      >Random</button>
      <SearchResults searchResults = {this.state.searchResults} />

    </div>
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('container')
);

