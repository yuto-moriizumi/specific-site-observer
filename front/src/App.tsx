import React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import Index from "./views/Index";
import { Badge, Nav, Navbar } from "react-bootstrap";
import MyPage from "./views/MyPage";
import Auth0ProviderWithHistory from "./auth0-provider-with-history";
import LoginButton from "./components/loginButton";
import LogoutButton from "./components/logoutButton";
import { Auth0ContextInterface, withAuth0 } from "@auth0/auth0-react";

type Props = {
  auth0: Auth0ContextInterface;
};
type State = {
  isAuthenticated: boolean;
  isLoading: boolean;
};
class App extends React.Component<Props, State> {
  state: State = {
    isAuthenticated: this.props.auth0.isAuthenticated,
    isLoading: this.props.auth0.isLoading,
  };

  render() {
    if (this.props.auth0.isLoading) return <h1>LOADING</h1>;
    return (
      <Auth0ProviderWithHistory>
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
              <p>{"" + this.state.isAuthenticated}</p>
              {this.state.isAuthenticated ? <LogoutButton /> : <LoginButton />}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Route exact path="/" component={Index}></Route>
        <Route path="/mypage" component={MyPage}></Route>
      </Auth0ProviderWithHistory>
    );
  }
}

export default withAuth0(App);
