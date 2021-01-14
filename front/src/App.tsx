import React from "react";
import "./App.css";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import Index from "./views/Index";
import { Badge, Button, Nav, Navbar } from "react-bootstrap";
import MyPage from "./views/MyPage";

function App() {
  return (
    <React.Fragment>
      <Router>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand>
            <Link to="/" className="h2">
              Specific Site Observer
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto h1">
              <Badge variant="primary">Your Name</Badge>
              <Button size="lg">Login</Button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Route exact path="/" component={Index}></Route>
        <Route path="/mypage" component={MyPage}></Route>
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
