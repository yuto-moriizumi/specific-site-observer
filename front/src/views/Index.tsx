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

export default class Index extends React.Component {
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
            <Col>
              <Card>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                  <Card.Title>Taro Tanaka</Card.Title>
                  <Card.Subtitle>GO TO PARK! (2019)</Card.Subtitle>
                  <Card.Text>2021/10/10</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                  <Card.Title>Taro Tanaka</Card.Title>
                  <Card.Subtitle>GO TO PARK! (2019)</Card.Subtitle>
                  <Card.Text>2021/10/10</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </CardDeck>
        </Container>
      </React.Fragment>
    );
  }
}
