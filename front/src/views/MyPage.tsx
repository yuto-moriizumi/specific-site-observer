import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import {
  Button,
  Card,
  CardDeck,
  Col,
  Container,
  Form,
  FormControl,
  Modal,
  Row,
} from 'react-bootstrap';
import { faPlusSquare, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import Rate from 'rc-rate';
import axios from 'axios';
import { Auth0ContextInterface, withAuth0 } from '@auth0/auth0-react';
import dayjs from 'dayjs';
import getResponsiveElements from '../utils/getResponsiveElements';

type Subscription = {
  name: string;
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

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE;
if (!(SERVER_URL && AUDIENCE)) console.error('env invalid');

class MyPage extends React.Component<Props, State> {
  private static isValidUrl(url: string) {
    try {
      // eslint-disable-next-line no-new
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  private onClickAddBinded = this.onClickAdd.bind(this);

  private onClickNewBinded = this.onClickNew.bind(this);

  private onClickReadBinded = this.onClickRead.bind(this);

  private onClickDeleteBinded = this.onClickDelete.bind(this);

  private handleCloseBinded = this.handleClose.bind(this);

  private onNewCardUrlChangeBinded = this.onNewCardUrlChange.bind(this);

  private onNewCardRateChangeBinded = this.onNewCardRateChange.bind(this);

  private addSubscriptionBinded = this.addSubscription.bind(this);

  constructor(props: any) {
    super(props);
    this.state = {
      subscriptions: [],
      showModal: false,
      newCardUrl: '',
      newCardRate: 0,
    };
  }

  componentDidMount() {
    this.getSubscriptions();
  }

  private handleClose() {
    this.setState({ showModal: false });
  }

  private onClickAdd() {
    this.setState({ showModal: true });
  }

  // 新着ありがクリックされたときは、既読に変更する
  private onClickNew(index: number) {
    this.switchRead(index, false);
  }

  // 既読がクリックされたときは、新着に変更する
  private onClickRead(index: number) {
    this.switchRead(index, true);
  }

  // 購読を削除する
  private async onClickDelete(index: number) {
    // eslint-disable-next-line no-alert
    if (!window.confirm('本当に削除しますか?')) return;
    const { auth0 } = this.props;
    const token = await auth0.getAccessTokenSilently({
      audience: AUDIENCE,
    });
    const { subscriptions } = this.state;
    axios
      .post(
        `${SERVER_URL}/api/subscriptions/delete`,
        {
          url: subscriptions[index].url,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() =>
        this.setState({
          subscriptions: subscriptions.filter(
            (subscription) => subscription.url !== subscriptions[index].url
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

  private async onRateChange(index: number, rate: number) {
    const { auth0 } = this.props;
    const token = await auth0.getAccessTokenSilently({
      audience: AUDIENCE,
    });
    const { subscriptions } = this.state;
    axios
      .post(
        `${SERVER_URL}/api/subscriptions/rank/`,
        {
          url: subscriptions[index].url,
          rank: rate,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => this.getSubscriptions()) // サーバから最新情報を取得
      .catch((err) => console.log(err));
  }

  private async getSubscriptions() {
    const { auth0 } = this.props;
    const token = await auth0.getAccessTokenSilently({
      audience: AUDIENCE,
    });
    axios
      .get(`${SERVER_URL}/api/subscriptions`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => this.setState({ subscriptions: res.data }))
      .catch((err) => console.log(err));
  }

  private async addSubscription() {
    const { newCardUrl, newCardRate } = this.state;
    const { auth0 } = this.props;
    if (!MyPage.isValidUrl(newCardUrl)) return;
    const token = await auth0.getAccessTokenSilently({
      audience: AUDIENCE,
    });
    this.handleClose();
    axios
      .post(
        `${SERVER_URL}/api/subscriptions`,
        {
          url: newCardUrl,
          star: newCardRate,
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

  // 既読未読を切り替える
  private async switchRead(index: number, has_new: boolean) {
    const { auth0 } = this.props;

    const token = await auth0.getAccessTokenSilently({
      audience: AUDIENCE,
    });
    const { subscriptions } = this.state;
    axios
      .post(
        `${SERVER_URL}/api/subscriptions/new/`,
        {
          url: subscriptions[index].url,
          has_new,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        const new_subscriptions = subscriptions.slice();
        new_subscriptions[index].has_new = has_new;
        this.setState({
          subscriptions: new_subscriptions,
        });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { newCardUrl, showModal, subscriptions } = this.state;
    return (
      <>
        <Container className="my-4">
          <Row>
            <Col xs="auto">
              <h1>マイページ</h1>
            </Col>
            <Col xs="auto" className="ml-auto">
              <Button size="lg" onClick={this.onClickAddBinded}>
                <Row noGutters>
                  <Col xs="auto" className="mr-2">
                    <FontAwesomeIcon icon={faPlusSquare} />
                  </Col>
                  <Col xs="auto">ウォッチャカードを追加</Col>
                </Row>
              </Button>
            </Col>
          </Row>
        </Container>
        {/* 購読追加モーダル */}
        <Modal show={showModal} onHide={this.handleCloseBinded}>
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
                    value={newCardUrl}
                    onChange={this.onNewCardUrlChangeBinded}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column xs={2}>
                  評価
                </Form.Label>
                <Col xs={10}>
                  <Rate
                    onChange={this.onNewCardRateChangeBinded}
                    defaultValue={0}
                  />
                </Col>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.addSubscriptionBinded}>
              追加
            </Button>
          </Modal.Footer>
        </Modal>
        <Container fluid>
          <CardDeck className="no-gutters">
            {getResponsiveElements(
              subscriptions.map((subscription, i) => {
                const key = i + subscription.url;
                return (
                  <Card key={key} className="mb-3">
                    <Card.Link href={subscription.url} target="_blank">
                      <Card.Img
                        variant="top"
                        src={subscription.img}
                        referrerPolicy="no-referrer"
                      />
                      <Card.Title className="pt-2 px-3 mb-0">
                        {subscription.title}
                      </Card.Title>
                    </Card.Link>
                    <Card.Body className="pt-2 pb-3">
                      <Card.Subtitle className="pb-1">
                        {subscription.name}
                      </Card.Subtitle>
                      <Rate
                        defaultValue={subscription.rating}
                        onChange={(rate) => {
                          this.onRateChange(i, rate);
                        }}
                      />
                      <Row className="no-gutters">
                        <Col xs="auto">
                          {dayjs(subscription.updated).format('YYYY/MM/DD')}
                        </Col>
                        <Col xs="auto" className="ml-auto mr-1">
                          {subscription.has_new ? (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => this.onClickNewBinded(i)}
                            >
                              NEW
                            </Button>
                          ) : (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => this.onClickReadBinded(i)}
                            >
                              READ
                            </Button>
                          )}
                        </Col>
                        <Col xs="auto">
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => this.onClickDeleteBinded(i)}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} color="red" />
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                );
              })
            )}
          </CardDeck>
        </Container>
      </>
    );
  }
}

export default withAuth0(MyPage);
