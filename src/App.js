import React, { Component } from "react";
import "./App.css";

const list = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1
  }
];

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list,
      searchTerm: ""
    };
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleDismiss(id) {
    this.setState({
      list: [...this.state.list.filter(item => item.objectID !== id)]
    });
  }

  handleSearchChange(event) {
    const { value } = event.target;
    this.setState({
      searchTerm: value
    });
  }

  render() {
    const { searchTerm, list } = this.state;
    return (
      <div className="page">
        <Search
          className="interactions"
          value={searchTerm}
          onChange={this.handleSearchChange}
        >
          Search
        </Search>

        <Table
          pattern={searchTerm}
          list={list}
          onDismiss={this.handleDismiss}
        />
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
  const { pattern, list, onDismiss } = props;
  const largeColumn = { width: "40%" };
  const midColumn = { width: "30%" };
  const smallColumn = { width: "10%" };
  return (
    <div className="table">
      {list.filter(isSearched(pattern)).map(item => {
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
