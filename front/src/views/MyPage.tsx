import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Card, CardDeck, Col, Container, Row } from "react-bootstrap";
import {
  faPlusSquare,
  faEnvelope,
  faTrashAlt,
} from "@fortawesome/free-regular-svg-icons";
import Rate from "rc-rate";

type State = {
  pages: {
    url: string;
    title: string;
    img: string;
    updated: string;
    rating: number;
  }[];
};
export default class Index extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Container className="mt-5">
          <Row>
            <Col>
              <h1>マイページ</h1>
            </Col>
            <Col>
              <Button size="lg" className="pt-1">
                <Row>
                  <Col xs={1}>
                    <FontAwesomeIcon icon={faPlusSquare} />
                  </Col>
                  <Col>ウォッチャカードを追加</Col>
                </Row>
              </Button>
            </Col>
          </Row>
          <CardDeck>
            <Col>
              <Card>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                  <Card.Title>Taro Tanaka</Card.Title>
                  <Card.Subtitle>GO TO PARK! (2019)</Card.Subtitle>
                  <Rate />
                  <Card.Text>
                    <Row>
                      <Col>2021/10/10</Col>
                      <Col xs={1}>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </Col>
                      <Col xs={1}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </Col>
                    </Row>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                  <Card.Title>Taro Tanaka</Card.Title>
                  <Card.Subtitle>GO TO PARK! (2019)</Card.Subtitle>
                  <Rate />
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
