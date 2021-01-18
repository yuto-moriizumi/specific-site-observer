import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {
  Badge,
  Button,
  Card,
  CardDeck,
  Col,
  Container,
  Form,
  FormControl,
  Modal,
  Row,
} from "react-bootstrap";
import {
  faPlusSquare,
  faEnvelope,
  faTrashAlt,
} from "@fortawesome/free-regular-svg-icons";
import Rate from "rc-rate";
import axios from "axios";
import { Router } from "react-router";
import { Auth0ContextInterface, withAuth0 } from "@auth0/auth0-react";

type Subscription = {
  url: string;
  title: string;
  img: string;
  updated: string;
  rating: number;
  has_new: boolean;
};
type State = {
  subscriptions: Subscription[];
  showModal: boolean;
  newCardUrl: string;
  newCardRate: number;
};
type Props = {
  auth0: Auth0ContextInterface;
};
class Index extends React.Component<Props, State> {
  private AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE;
  constructor(props: any) {
    super(props);
    this.state = {
      subscriptions: [],
      showModal: false,
      newCardUrl: "",
      newCardRate: 0,
    };
    this.getSubscriptions();
  }

  private async getSubscriptions() {
    const token = await this.props.auth0.getAccessTokenSilently({
      audience: this.AUDIENCE,
    });
    axios
      .get("/api/subscriptions/", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => this.setState({ subscriptions: res.data.subscriptions }))
      .catch((err) => console.log(err));
  }

  private onClickAdd() {
    this.setState({ showModal: true });
  }

  private isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  private async addSubscription() {
    if (!this.isValidUrl(this.state.newCardUrl)) return;
    const token = await this.props.auth0.getAccessTokenSilently({
      audience: this.AUDIENCE,
    });
    this.handleClose();
    axios
      .post(
        "/api/subscriptions/",
        {
          url: this.state.newCardUrl,
          star: this.state.newCardRate,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        this.getSubscriptions();
      })
      .catch((err) => console.log(err));
  }
  private handleClose() {
    this.setState({ showModal: false });
  }

  //既読未読を切り替える
  private async switchRead(index: number, has_new: boolean) {
    const token = await this.props.auth0.getAccessTokenSilently({
      audience: this.AUDIENCE,
    });
    axios
      .post(
        "/api/subscriptions/new/",
        {
          url: this.state.subscriptions[index].url,
          has_new: has_new,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        const subscriptions = this.state.subscriptions.slice();
        subscriptions[index].has_new = has_new;
        this.setState({
          subscriptions: subscriptions,
        });
      })
      .catch((err) => console.log(err));
  }

  //新着ありがクリックされたときは、既読に変更する
  private onClickNew(index: number) {
    this.switchRead(index, false);
  }

  //既読がクリックされたときは、新着に変更する
  private onClickRead(index: number) {
    this.switchRead(index, true);
  }

  //購読を削除する
  private async onClickDelete(index: number) {
    if (!window.confirm("本当に削除しますか?")) return;
    const token = await this.props.auth0.getAccessTokenSilently({
      audience: this.AUDIENCE,
    });
    axios
      .post(
        "/api/subscriptions/delete",
        {
          url: this.state.subscriptions[index].url,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() =>
        this.setState({
          subscriptions: this.state.subscriptions.filter(
            (subscription) =>
              subscription.url !== this.state.subscriptions[index].url
          ),
        })
      )
      .catch((err) => console.log(err));
  }

  private onNewCardUrlChange(
    e: React.ChangeEvent<typeof FormControl & HTMLInputElement>
  ) {
    this.setState({ newCardUrl: e.target.value });
  }
  private onNewCardRateChange(rate: number) {
    this.setState({ newCardRate: rate });
  }

  private onRateChange(index: number, rate: number) {
    axios
      .post("/api/subscriptions/rank/", {
        url: this.state.subscriptions[index].url,
        rank: rate,
      })
      .then(() => {
        // console.log(this.state.subscriptions[index].title, rate);
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <React.Fragment>
        <Container className="mt-5">
          <Row>
            <Col>
              <h1>マイページ</h1>
            </Col>
            <Col>
              <Button
                size="lg"
                className="pt-1"
                onClick={this.onClickAdd.bind(this)}
              >
                <Row>
                  <Col xs={1}>
                    <FontAwesomeIcon icon={faPlusSquare} />
                  </Col>
                  <Col>ウォッチャカードを追加</Col>
                </Row>
              </Button>
            </Col>
          </Row>
          {/* 購読追加モーダル */}
          <Modal
            show={this.state.showModal}
            onHide={this.handleClose.bind(this)}
          >
            <Modal.Header closeButton>
              <Modal.Title>ウォッチャカードを追加</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group as={Row}>
                  <Form.Label column xs={2}>
                    URL
                  </Form.Label>
                  <Col xs={10}>
                    <Form.Control
                      placeholder="https://www.google.com/"
                      type="url"
                      value={this.state.newCardUrl}
                      onChange={this.onNewCardUrlChange.bind(this)}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column xs={2}>
                    評価
                  </Form.Label>
                  <Col xs={10}>
                    <Rate onChange={this.onNewCardRateChange.bind(this)} />
                  </Col>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={this.addSubscription.bind(this)}
              >
                追加
              </Button>
            </Modal.Footer>
          </Modal>
          <CardDeck>
            {this.state.subscriptions.map((subscription, index) => (
              <Col key={index}>
                <Card>
                  <Card.Img variant="top" src={subscription.img} />
                  <Card.Body>
                    <Card.Title>{subscription.title}</Card.Title>
                    {/* <Card.Subtitle>GO TO PARK! (2019)</Card.Subtitle> */}
                    <Rate
                      defaultValue={subscription.rating}
                      onChange={(rate) => {
                        this.onRateChange(index, rate);
                      }}
                    />
                    <Card.Text>
                      <Container fluid>
                        <Row className="no-gutters">
                          <Col xs={9}>{subscription.updated}</Col>
                          <Col xs={2}>
                            {subscription.has_new ? (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={this.onClickNew.bind(this, index)}
                              >
                                NEW
                              </Button>
                            ) : (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={this.onClickRead.bind(this, index)}
                              >
                                READ
                              </Button>
                            )}
                          </Col>
                          <Col xs={1}>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={this.onClickDelete.bind(this, index)}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} color="red" />
                            </Button>
                          </Col>
                        </Row>
                      </Container>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </CardDeck>
        </Container>
      </React.Fragment>
    );
  }
}

export default withAuth0(Index);
