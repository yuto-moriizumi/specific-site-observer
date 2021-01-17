import React from "react";
import { Auth0ContextInterface, withAuth0 } from "@auth0/auth0-react";

type Props = {
  auth0: Auth0ContextInterface;
};
type State = {
  message: string;
};
class ExternalApi extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { message: "" };
  }
  render() {
    const AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE;
    // const [message, setMessage] = useState("");
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const callApi = async () => {
      try {
        const response = await fetch(
          new Request(`${serverUrl}/api/public/`, {
            method: "GET",
            headers: new Headers({
              Accept: "application/json",
            }),
          })
        );
        const responseData = await response.json();

        this.setState({ message: responseData.message });
      } catch (error) {
        this.setState({ message: error.message });
      }
    };

    const callSecureApi = async () => {
      try {
        const id_token = await this.props.auth0.getIdTokenClaims({
          audience: AUDIENCE,
        });
        console.log(id_token);
        const token = await this.props.auth0.getAccessTokenSilently({
          audience: AUDIENCE,
        });
        // const token = await this.props.auth0.getAccessTokenWithPopup();
        console.log("TOKEN:" + token);

        const response = await fetch(`${serverUrl}/api/private/`, {
          headers: {
            // authorization: `Bearer ${id_token.__raw}`,
            authorization: `Bearer ${token}`,
            // authorization:
            //   "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im9tZU8yT0Qwa0ZtVXBKYm1jN2kyNCJ9.eyJpc3MiOiJodHRwczovL2Rldi1lcTJpZzh1My5qcC5hdXRoMC5jb20vIiwic3ViIjoiWHloWXV6Y09YZzFXR29wb25ySFkwUGkwbmliV0tqUnVAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vZXhhbXBsZS5jb20iLCJpYXQiOjE2MTA4ODY0NjEsImV4cCI6MTYxMDk3Mjg2MSwiYXpwIjoiWHloWXV6Y09YZzFXR29wb25ySFkwUGkwbmliV0tqUnUiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.l4jpoJ6vU-D8VenRxhxNUjspFoni-B0IKxJ6k6Qi4O7GzApD2vdGkOlRb-FoP4lVwk3JXqB2qslVtYfksunCMCCZBYP3op6MmLNMLF-5KeI3ztpNLHmHpLvKbyLAC4E09PJdF6-z65xdhHx0vkN7ChxcsYFhUX4g20kOLlce0HWccCYqY1DEtomIjUxQ2DCDOl4Eg1BLOJjRh-T-TXAgSoinNlXQsMJ-PO2ItjF6bbkWLOiGehrMcI72DhqZzmDYXomXWV3OFgS2x2pcB0mtnAm-HopYLNz1-HYjX17u0FNT0-d7ubkfVKPvluNVPO6INW4FeB6bfVHQPP8JRbOq0A",
          },
        });

        const responseData = await response.json();

        this.setState({ message: responseData.message });
      } catch (error) {
        this.setState({ message: error.message });
      }
    };

    return (
      <div className="container">
        <h1>External API</h1>
        <p>
          Use these buttons to call an external API. The protected API call has
          an access token in its authorization header. The API server will
          validate the access token using the Auth0 Audience value.
        </p>
        <div
          className="btn-group mt-5"
          role="group"
          aria-label="External API Requests Examples"
        >
          <button type="button" className="btn btn-primary" onClick={callApi}>
            Get Public Message
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={callSecureApi}
          >
            Get Protected Message
          </button>
        </div>
        {this.state.message && (
          <div className="mt-5">
            <h6 className="muted">Result</h6>
            <div className="container-fluid">
              <div className="row">
                <code className="col-12 text-light bg-dark p-4">
                  {this.state.message}
                </code>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withAuth0(ExternalApi);
