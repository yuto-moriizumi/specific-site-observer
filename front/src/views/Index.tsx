import React from 'react';
import { Button, Card, CardDeck, Container, Jumbotron } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import getResponsiveElements from '../utils/getResponsiveElements';

type Page = {
  name: string;
  url: string;
  title: string;
  img: string;
  updated: string;
};
interface State {
  pages: Page[];
}

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
if (!SERVER_URL) console.error('SERVER_URL must be specified');

export default class Index extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = { pages: [] };
  }

  componentDidMount() {
    axios
      .get(`${SERVER_URL}/api/pages`)
      .then((res) => {
        this.setState({ pages: res.data });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { pages } = this.state;
    return (
      <>
        <Jumbotron>
          <Container>
            <h1>お気に入りの更新監視を簡単に。</h1>
            <p>
              特定のサイトのお気に入りページを一つ一つ確認するのは大変。
              <br />
              面倒なことは、アプリにやらせよう！
            </p>
            <Link to="mypage">
              <Button>GO MYPAGE</Button>
            </Link>
          </Container>
        </Jumbotron>
        <Container fluid className="px-5">
          <h2 className="h1 mb-3">更新情報</h2>
          <CardDeck className="no-gutters">
            {getResponsiveElements(
              pages.map((page: Page) => (
                <Card key={page.url} className="mb-3">
                  <Card.Link href={page.url} target="_blank" rel="noreferrer">
                    <Card.Img
                      variant="top"
                      src={page.img}
                      referrerPolicy="no-referrer"
                    />
                    <Card.Title className="pt-2 px-3 mb-0">
                      {page.title}
                    </Card.Title>
                  </Card.Link>
                  <Card.Body className="pt-2 pb-3">
                    <Card.Subtitle>{page.name}</Card.Subtitle>
                  </Card.Body>
                  <Card.Footer>
                    {dayjs(page.updated).format('YYYY/MM/DD')}
                  </Card.Footer>
                </Card>
              ))
            )}
          </CardDeck>
        </Container>
      </>
    );
  }
}
