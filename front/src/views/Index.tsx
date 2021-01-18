import React from "react";
import {
  Button,
  Card,
  CardDeck,
  Col,
  Container,
  Jumbotron,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

interface State {
  pages: {
    url: string;
    title: string;
    img: string;
    updated: string;
  }[];
}
export default class Index extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = { pages: [] };
    axios
      .get("/api/pages/")
      .then((res) => this.setState({ pages: res.data.pages }))
      .catch((err) => console.log(err));
  }
  render() {
    return (
      <React.Fragment>
        <Jumbotron>
          <h1>お気に入りの更新監視を簡単に。</h1>
          <p>
            特定のサイトのお気に入りページを一つ一つ確認するのは大変。
            <br />
            面倒なことは、アプリにやらせよう！
          </p>
          <Link to="mypage">
            <Button>GO MYPAGE</Button>
          </Link>
        </Jumbotron>
        <Container>
          <h2>更新情報</h2>
          <CardDeck>
            {this.state.pages.map((page) => (
              <Col>
                <a href={page.url} target="_blank" rel="noreferrer">
                  <Card>
                    <Card.Img variant="top" src={page.img} />
                    <Card.Body>
                      <Card.Title>{page.title}</Card.Title>
                      <Card.Text>{page.updated}</Card.Text>
                    </Card.Body>
                  </Card>
                </a>
              </Col>
            ))}
          </CardDeck>
        </Container>
      </React.Fragment>
    );
  }
}
