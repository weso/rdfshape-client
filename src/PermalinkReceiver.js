import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Alert, Button, Container, Row } from "react-bootstrap";
import API from "./API";
import { getOriginalLink } from "./Permalink";

export default function PermalinkReceiver(props) {
  const [link, setLink] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const fetchLink = async (urlCode) => {
      const fetchLink = await getOriginalLink(urlCode);
      if (fetchLink[0]) {
        setLink(fetchLink[1]);
        window.location.replace(fetchLink[1]);
      } else setError(fetchLink[1]);
    };

    const code = props.match.params[API.queryParameters.permalink.code];
    if (code) {
      fetchLink(code);
    }
  }, []);

  return (
    <Container fluid={true}>
      {error ? (
        <>
          <Row>
            <h1>Ooops...wrong route</h1>
          </Row>
          <Row>
            <p>
              Seems like the permalink you are trying to use is invalid or has
              expired. Further information below:
            </p>
          </Row>
          <Row>
            <Alert className="width-100" variant="danger">
              {error}
            </Alert>
          </Row>
          <hr />
          <Row>
            <Button variant="primary" href="/">
              Return home
            </Button>
          </Row>
        </>
      ) : (
        <>
          <p>Redirecting to your link...</p>
        </>
      )}
    </Container>
  );
}
