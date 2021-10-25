import axios from "axios";
import qs from "query-string";
import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import API from "../API";
import { mkPermalinkLong, params2Form } from "../Permalink";
import ResultShExInfo from "../results/ResultShExInfo";
import { mkError } from "../utils/ResponseError";
import {
  getShexText,
  InitialShEx,
  mkShExTabs,
  paramsFromStateShEx,
  shExParamsFromQueryParams,
  updateStateShEx
} from "./ShEx";

function ShExInfo(props) {
  const [shex, setShEx] = useState(InitialShEx);

  const [result, setResult] = useState("");

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [permalink, setPermalink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  const url = API.schemaInfo;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      let paramsShEx = {};

      if (
        queryParams.schema ||
        queryParams.schemaUrl ||
        queryParams.schemaFile
      ) {
        const schemaParams = shExParamsFromQueryParams(queryParams);
        const finalSchema = updateStateShEx(schemaParams, shex) || shex;
        setShEx(finalSchema);
        paramsShEx = finalSchema;
      }

      let params = {
        ...paramsFromStateShEx(paramsShEx),
        schemaEngine: "ShEx",
      };
      setParams(params);
      setLastParams(params);
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params && !loading) {
      if (
        params.schema ||
        params.schemaUrl ||
        (params.schemaFile && params.schemaFile.name)
      ) {
        resetState();
        setUpHistory();
        postRequest();
      } else {
        setError("No ShEx schema provided");
      }
      window.scrollTo(0, 0);
    }
  }, [params]);

  function handleSubmit(event) {
    event.preventDefault();
    setParams({
      ...paramsFromStateShEx(shex),
      schemaEngine: "ShEx",
    });
  }

  function postRequest(cb) {
    setLoading(true);
    setProgressPercent(20);
    const formData = params2Form(params);

    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        setProgressPercent(70);
        setResult(data);
        setPermalink(mkPermalinkLong(API.shExInfoRoute, params));
        setProgressPercent(90);
        checkLinks();
        if (cb) cb();
        setProgressPercent(100);
      })
      .catch(function(error) {
        setError(mkError(error, url));
      })
      .finally(() => setLoading(false));
  }

  // Disabled permalinks, etc. if the user input is too long or a file
  function checkLinks() {
    const disabled =
      getShexText(shex).length > API.byTextCharacterLimit
        ? API.byTextTab
        : shex.activeTab === API.byFileTab
        ? API.byFileTab
        : false;

    setDisabledLinks(disabled);
  }

  function setUpHistory() {
    // Store the last search URL in the browser history to allow going back
    if (
      params &&
      lastParams &&
      JSON.stringify(params) !== JSON.stringify(lastParams)
    ) {
      // eslint-disable-next-line no-restricted-globals
      history.pushState(
        null,
        document.title,
        mkPermalinkLong(API.shExInfoRoute, lastParams)
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.shExInfoRoute, params)
    );

    setLastParams(params);
  }

  function resetState() {
    setResult(null);
    setPermalink(null);
    setError(null);
    setProgressPercent(0);
  }

  return (
    <Container fluid={true}>
      <Row>
        <h1>ShEx: Info about ShEx schema</h1>
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkShExTabs(shex, setShEx, "ShEx Input")}
            <hr />
            <Button
              variant="primary"
              type="submit"
              className={"btn-with-icon " + (loading ? "disabled" : "")}
              disabled={loading}
            >
              Info about ShEx schema
            </Button>
          </Form>
        </Col>
        {loading || result || error || permalink ? (
          <Col className={"half-col"}>
            {loading ? (
              <ProgressBar
                striped
                animated
                variant="info"
                now={progressPercent}
              />
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : result ? (
              <ResultShExInfo
                result={result}
                permalink={permalink}
                disabled={disabledLinks}
              />
            ) : null}
          </Col>
        ) : (
          <Col className={"half-col"}>
            <Alert variant="info">Results will appear here</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default ShExInfo;
