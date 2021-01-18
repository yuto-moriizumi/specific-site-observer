import React from "react";
import { Link, Route } from "react-router-dom";
import Index from "./views/Index";
import { Nav, Navbar, Image } from "react-bootstrap";
import MyPage from "./views/MyPage";
import { Auth0ContextInterface, withAuth0 } from "@auth0/auth0-react";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import ExternalApi from "./components/ExternalApi";

type Props = {
  auth0: Auth0ContextInterface;
};

class App extends React.Component<Props, {}> {
  render() {
    if (this.props.auth0.isLoading) return <h1>LOADING</h1>;
    return (
      <>
        <Navbar bg="light" expand="sm">
          <Navbar.Brand>
            <Link to="/" className="h2">
              Specific Site Observer
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Item>
                <Link to="/exapi">API</Link>
              </Nav.Item>
              {this.props.auth0.isAuthenticated ? (
                <>
                  <Nav.Item>
                    <Image src={this.props.auth0.user.picture} thumbnail />
                  </Nav.Item>
                  <Nav.Item className="pt-2 mx-2">
                    {this.props.auth0.user.nickname}
                  </Nav.Item>
                  <LogoutButton />
                </>
              ) : (
                <LoginButton />
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Route exact path="/" component={Index}></Route>
        <Route path="/exapi" component={ExternalApi}></Route>
        <ProtectedRoute path="/mypage" component={MyPage}></ProtectedRoute>
      </>
    );
  }
}

export default withAuth0(App);
