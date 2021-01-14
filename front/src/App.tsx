import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Index from "./views/Index";

function App() {
  return (
    <React.Fragment>
      <header>
        <h1>Specific Site Observer</h1>
      </header>
      <Router>
        <Route exact path="/" component={Index}></Route>
      </Router>
    </React.Fragment>
  );
}

export default App;

{
  /* <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div> */
}
