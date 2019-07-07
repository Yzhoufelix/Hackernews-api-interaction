import React, { Component } from "react";
import "./App.css";

const DEFAULT_QUERY = "redux";
const DEFAULT_HPP = "50";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

// const isSearched = searchTerm => item =>
//   item.title.toLowerCase().includes(searchTerm.toLowerCase());

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
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchStories(searchTerm);
  }

  fetchSearchStories(searchTerm, page = 0) {
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(response => response.json())
      .then(result => this.setSearchStories(result))
      .catch(error => error);
  }

  setSearchStories(result) {
    const { hits, page } = result;
    const oldHits = page === 0 ? [] : this.state.result.hits; // paginated hits
    const updatedHits = [...oldHits, ...hits];
    this.setState({
      result: { ...this.state.result, hits: updatedHits, page }
    });
  }

  handleDismiss(id) {
    const { result } = this.state;
    const updatedHits = result.hits.filter(item => item.objectID !== id);
    this.setState({
      result: Object.assign({}, result, { hits: updatedHits })
    });
  }

  handleSearchChange(event) {
    const { value } = event.target;
    this.setState({
      searchTerm: value
    });
  }

  handleSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchStories(searchTerm);
    event.preventDefault();
  }

  render() {
    const { searchTerm, result } = this.state;
    const page = result ? result.page : 0;

    return (
      <div className="page">
        <Search
          className="interactions"
          value={searchTerm}
          onChange={this.handleSearchChange}
          onSubmit={this.handleSearchSubmit}
        >
          Search
        </Search>

        {result ? (
          <Table result={result.hits} onDismiss={this.handleDismiss} />
        ) : null}

        <div className="interactions">
          <Button onClick={() => this.fetchSearchStories(searchTerm, page + 1)}>
            More
          </Button>
        </div>
      </div>
    );
  }
}

export default App;

const Search = props => {
  const { value, onChange, children, className, onSubmit } = props;
  return (
    <form className={className} onSubmit={onSubmit}>
      <input type="text" value={value} onChange={onChange} />
      <button type="submit">{children}</button>
    </form>
  );
};

const Table = props => {
  const { result, onDismiss } = props;
  const largeColumn = { width: "40%" };
  const midColumn = { width: "30%" };
  const smallColumn = { width: "10%" };
  return (
    <div className="table">
      {result.map(item => {
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
