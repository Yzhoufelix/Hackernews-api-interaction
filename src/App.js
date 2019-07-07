import React, { Component } from "react";
import "./App.css";

const DEFAULT_QUERY = "redux";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    };
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.setSearchStories = this.setSearchStories.bind(this);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchStories(result))
      .catch(error => error);
  }

  setSearchStories(result) {
    this.setState({
      result
    });
  }

  handleDismiss(id) {
    this.setState({
      result: [...this.state.result.filter(item => item.objectID !== id)]
    });
  }

  handleSearchChange(event) {
    const { value } = event.target;
    this.setState({
      searchTerm: value
    });
  }

  render() {
    const { searchTerm, result } = this.state;

    return (
      <div className="page">
        <Search
          className="interactions"
          value={searchTerm}
          onChange={this.handleSearchChange}
        >
          Search
        </Search>

        {result ? (
          <Table
            pattern={searchTerm}
            result={result.hits}
            onDismiss={this.handleDismiss}
          />
        ) : null}
      </div>
    );
  }
}

export default App;

const Search = props => {
  const { value, onChange, children, className } = props;
  return (
    <form className={className}>
      {children}
      <input type="text" value={value} onChange={onChange} />
    </form>
  );
};

const Table = props => {
  const { pattern, result, onDismiss } = props;
  const largeColumn = { width: "40%" };
  const midColumn = { width: "30%" };
  const smallColumn = { width: "10%" };
  return (
    <div className="table">
      {result.filter(isSearched(pattern)).map(item => {
        return (
          <div key={item.objectID} className="table-row">
            <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={midColumn}>{item.author}</span>{" "}
            <span style={smallColumn}>{item.num_comments}</span>{" "}
            <span style={smallColumn}>{item.points}</span>
            <span style={smallColumn}>
              <Button
                className="button-inline"
                onClick={() => onDismiss(item.objectID)}
              >
                Dismiss
              </Button>
            </span>
          </div>
        );
      })}
    </div>
  );
};

const Button = props => {
  const { onClick, className = "", children } = props;
  return (
    <button onClick={onClick} className={className} type="button">
      {children}
    </button>
  );
};
