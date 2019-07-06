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
    return (
      <div className="App">
        <form>
          <input onChange={this.handleSearchChange} type="text" />
        </form>
        {this.state.list
          .filter(item =>
            item.title
              .toLowerCase()
              .includes(this.state.searchTerm.toLowerCase())
          )
          .map(item => {
            return (
              <div key={item.objectID}>
                <span>
                  <a href={item.url}>{item.title}</a>
                </span>
                <span>{item.author}</span> <span>{item.num_comments}</span>{" "}
                <span>{item.points}</span>
                <span>
                  <button
                    type="button"
                    onClick={() => this.handleDismiss(item.objectID)}
                  >
                    Dismiss
                  </button>
                </span>
              </div>
            );
          })}
      </div>
    );
  }
}

export default App;
