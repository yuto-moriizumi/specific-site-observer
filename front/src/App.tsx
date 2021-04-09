import React from 'react';
import { Link, Route } from 'react-router-dom';
import { Nav, Navbar, Image } from 'react-bootstrap';
import { Auth0ContextInterface, withAuth0 } from '@auth0/auth0-react';
import Index from './views/Index';
import MyPage from './views/MyPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';

type Props = {
  auth0: Auth0ContextInterface;
};

class App extends React.Component<Props, {}> {
  render() {
    const { auth0 } = this.props;
    if (auth0.isLoading) return <h1>LOADING</h1>;
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
              {auth0.isAuthenticated ? (
                <>
                  <Nav.Item>
                    <Image
                      src={auth0.user.picture}
                      thumbnail
                      className="img-fluid"
                      style={{ maxHeight: '5vh' }}
                    />
                  </Nav.Item>
                  <Nav.Item className="pt-2 mx-2">
                    {auth0.user.nickname}
                  </Nav.Item>
                  <Nav.Item>
                    <LogoutButton />
                  </Nav.Item>
                </>
              ) : (
                <Nav.Item>
                  <LoginButton />
                </Nav.Item>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Route exact path="/" component={Index} />
        <ProtectedRoute path="/mypage" component={MyPage} />
      </>
    );
  }
}

export default withAuth0(App);
//
