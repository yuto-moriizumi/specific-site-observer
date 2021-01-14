import React from "react";
import { Auth0ContextInterface, withAuth0 } from "@auth0/auth0-react";

type Props = {
  auth0: Auth0ContextInterface;
};
class LoginButton extends React.Component<Props, {}> {
  render() {
    const { loginWithRedirect } = this.props.auth0;
    return (
      <button
        className="btn btn-primary btn-block"
        onClick={() => loginWithRedirect()}
      >
        Log In
      </button>
    );
  }
}

export default withAuth0(LoginButton);
