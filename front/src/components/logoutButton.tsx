import React from "react";
import { Auth0ContextInterface, withAuth0 } from "@auth0/auth0-react";

type Props = {
  auth0: Auth0ContextInterface;
};
class LogoutButton extends React.Component<Props, {}> {
  render() {
    const { logout } = this.props.auth0;
    return (
      <button
        className="btn btn-danger btn-block"
        onClick={() =>
          logout({
            returnTo: window.location.origin,
          })
        }
      >
        Log Out
      </button>
    );
  }
}

export default withAuth0(LogoutButton);
