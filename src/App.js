import React, { Component } from "react";
import "./App.css";
import axios from "axios";

const DEFAULT_QUERY = "redux";
const DEFAULT_HPP = "50";
const PATH_BASE = "https://hn.algolia.com/api/v1";
// const PATH_BASE = "https://hn.mydomain.com/api/v1"; // test url
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
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      error: null
    };
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.setSearchStories = this.setSearchStories.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({
      searchKey: searchTerm
    });
    this.fetchSearchStories(searchTerm);
  }

  fetchSearchStories(searchTerm, page = 0) {
    axios(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(result => this.setSearchStories(result.data))
      .catch(error => this.setState({ error })); // error handling
  }

  setSearchStories(result) {
    const { results, searchKey } = this.state;
    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : []; // paginated hits
    const updatedHits = [...oldHits, ...result.hits];
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page: result.page }
      }
    });
  }

  handleDismiss(id) {
    const { results, searchKey } = this.state;
    const updatedHits = results[searchKey].hits.filter(
      item => item.objectID !== id
    );
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page: results[searchKey].page }
      }
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
    this.setState({
      searchKey: searchTerm
    });

    // prevent API request when a result is a available in the cache
    if (!this.state.results[searchTerm]) {
      this.fetchSearchStories(searchTerm);
    }
    event.preventDefault();
  }

  render() {
    const { searchTerm, results, searchKey, error } = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;

    const hits =
      (results && results[searchKey] && results[searchKey].hits) || [];

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

        {error ? (
          <div className="interactions">
            <p>Something went wrong.</p> {/*error massage*/}
          </div>
        ) : (
          <Table result={hits} onDismiss={this.handleDismiss} />
        )}

        <div className="interactions">
          <Button onClick={() => this.fetchSearchStories(searchKey, page + 1)}>
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
