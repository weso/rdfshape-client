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
import EndpointInput from "../endpoint/EndpointInput";
import { mkPermalinkLong, params2Form } from "../Permalink";
import ResultValidate from "../results/ResultValidate";
import {
  getShapeMapText,
  InitialShapeMap,
  mkShapeMapTabs,
  paramsFromStateShapemap,
  updateStateShapeMap
} from "../shapeMap/ShapeMap";
import { mkError } from "../utils/ResponseError";
import {
  getShexText,
  InitialShex,
  mkShexTabs,
  paramsFromStateShex,
  updateStateShex
} from "./Shex";

function ShexValidateEndpoint(props) {
  const [endpoint, setEndpoint] = useState("");

  const [shex, setShEx] = useState(InitialShex);
  const [shapeMap, setShapeMap] = useState(InitialShapeMap);

  const [result, setResult] = useState("");

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [permalink, setPermalink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  const url = API.routes.server.schemaValidate;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      let paramsShEx,
        paramsShapeMap = {};
      let userEndpoint = "";

      if (queryParams[API.queryParameters.schema.schema]) {
        paramsShEx = updateStateShex(queryParams, shex) || shex;
        setShEx(paramsShEx);
      }

      if (queryParams[API.queryParameters.shapeMap.shapeMap]) {
        paramsShapeMap = updateStateShapeMap(queryParams, shapeMap) || shapeMap;
        setShapeMap(paramsShapeMap);
      }

      // Endpoint State
      if (queryParams[API.queryParameters.endpoint.endpoint]) {
        userEndpoint = queryParams[API.queryParameters.endpoint.endpoint];
        setEndpoint(userEndpoint);
      }

      const params = mkParams(paramsShEx, paramsShapeMap, userEndpoint);
      setParams(params);
      setLastParams(params);
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params && !loading) {
      const endpointPresent = !!params[API.queryParameters.endpoint.endpoint];
      const schemaPresent =
        params[API.queryParameters.schema.schema] &&
        (params[API.queryParameters.schema.source] == API.sources.byFile
          ? params[API.queryParameters.schema.schema].name
          : true);

      const shapeMapPresent =
        params[API.queryParameters.shapeMap.shapeMap] &&
        (params[API.queryParameters.shapeMap.source] == API.sources.byFile
          ? params[API.queryParameters.shapeMap.shapeMap].name
          : true);

      if (!endpointPresent) setError(API.texts.noProvidedEndpoint);
      else if (!schemaPresent) setError(API.texts.noProvidedSchema);
      else if (!shapeMapPresent) setError(API.texts.noProvidedShapeMap);
      else {
        resetState();
        setUpHistory();
        postValidate();
      }
      window.scrollTo(0, 0);
    }
  }, [params]);

  function handleEndpointChange(value) {
    setEndpoint(value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    setParams(mkParams());
  }

  function mkParams(
    paramsShex = shex,
    paramsShapeMap = shapeMap,
    userEndpoint = endpoint
  ) {
    const newParams = {
      ...paramsFromStateShex(paramsShex),
      ...paramsFromStateShapemap(paramsShapeMap), // + trigger mode
      [API.queryParameters.schema.targetEngine]: API.engines.shex, // Target is always ShEx
    };

    // Add endpoint, if any
    userEndpoint &&
      (newParams[API.queryParameters.endpoint.endpoint] = userEndpoint);

    return newParams;
  }

  function postValidate(cb) {
    setLoading(true);
    setProgressPercent(15);
    const formData = params2Form(params);
    setProgressPercent(30);

    console.info(params);

    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        setResult(data);
        setProgressPercent(70);
        setPermalink(
          mkPermalinkLong(API.routes.client.shexValidateEndpointRoute, params)
        );
        setProgressPercent(80);
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
      endpoint.length +
        getShexText(shex).length +
        getShapeMapText(shapeMap).length >
      API.limits.byTextCharacterLimit
        ? API.sources.byText
        : shex.activeSource === API.sources.byFile ||
          shapeMap.activeSource === API.sources.byFile
        ? API.sources.byFile
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
        mkPermalinkLong(API.routes.client.shexValidateEndpointRoute, lastParams)
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.routes.client.shexValidateEndpointRoute, params)
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
        <h1>{API.texts.pageHeaders.shexValidationEndpoint}</h1>
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            <EndpointInput
              value={endpoint}
              handleOnChange={handleEndpointChange}
            />
            <hr />
            {mkShexTabs(shex, setShEx)}
            <hr />
            {mkShapeMapTabs(shapeMap, setShapeMap)}
            <hr />
            <Button
              variant="primary"
              type="submit"
              className={"btn-with-icon " + (loading ? "disabled" : "")}
              disabled={loading}
            >
              Validate from endpoint
            </Button>
          </Form>
        </Col>
        {loading || result || permalink || error ? (
          <Col className={"half-col"}>
            {loading ? (
              <ProgressBar
                className="width-100"
                striped
                animated
                variant="info"
                now={progressPercent}
              />
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : result ? (
              <ResultValidate
                result={result}
                permalink={permalink}
                disabled={disabledLinks}
              />
            ) : null}
          </Col>
        ) : (
          <Col className={"half-col"}>
            <Alert variant="info">
              {API.texts.validationResultsWillAppearHere}
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default ShexValidateEndpoint;
