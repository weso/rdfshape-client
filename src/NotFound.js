import React from "react";
import { Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";

function NotFound() {
  return (
    <Container fluid={true}>
      <Row>
        <h1>Not found</h1>
      </Row>
      <Row>
        <Button variant="primary" href="/">
          Return home
        </Button>
      </Row>
    </Container>
  );
}

export default NotFound;
