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
import { InitialData, mkDataTabs, paramsFromStateData } from "../data/Data";
import EndpointInput from "../endpoint/EndpointInput";
import { mkPermalink, mkPermalinkLong, params2Form } from "../Permalink";
import ResultValidate from "../results/ResultValidate";
import {
    InitialShapeMap,
    mkShapeMapTabs,
    paramsFromStateShapeMap,
    shapeMapParamsFromQueryParams
} from "../shapeMap/ShapeMap";
import { dataParamsFromQueryParams } from "../utils/Utils";
import {
    InitialShEx,
    mkShExTabs,
    paramsFromStateShEx,
    shExParamsFromQueryParams
} from "./ShEx";

function ShExValidate(props) {
  const [shex, setShEx] = useState(InitialShEx);
  const [data, setData] = useState(InitialData);
  const [shapeMap, setShapeMap] = useState(InitialShapeMap);

  const [endpoint, setEndpoint] = useState("");
  const [withEndpoint, setWithEndpoint] = useState(false);

  const [result, setResult] = useState("");

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [permalink, setPermalink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const url = API.schemaValidate;

  useEffect(() => {
    if (props.location.search) {
      const queryParams = qs.parse(props.location.search);
      let paramsData,
        paramsShEx,
        paramsShapeMap,
        paramsEndpoint = {};

      if (queryParams.data || queryParams.dataURL || queryParams.dataFile) {
        paramsData = dataParamsFromQueryParams(queryParams);
        // Update codemirror 1
        if (queryParams.data) {
          const codeMirrorElement = document.querySelectorAll(
            ".react-codemirror2"
          )[0].firstChild;
          if (codeMirrorElement && codeMirrorElement.CodeMirror)
            codeMirrorElement.CodeMirror.setValue(queryParams.data);
        }
        queryParams.dataURL && setData({...data, url: queryParams.dataURL})
      }
      if (
        queryParams.schema ||
        queryParams.schemaURL ||
        queryParams.schemaFile
      ) {
        paramsShEx = shExParamsFromQueryParams(queryParams);
        // Update codemirror 2
        if (queryParams.schema) {
          const codeMirrorElement = document.querySelector(
            ".yashe .CodeMirror"
          );
          if (codeMirrorElement && codeMirrorElement.CodeMirror)
            codeMirrorElement.CodeMirror.setValue(queryParams.schema);
        }

        queryParams.schemaURL && setShEx({...shex, url: queryParams.schemaURL})
      }

      if (
        queryParams.shapeMap ||
        queryParams.shapeMapURL ||
        queryParams.shapeMapFile
      ) {
        paramsShapeMap = shapeMapParamsFromQueryParams(queryParams);
        // Update codemirror 3
        if (queryParams.shapeMap) {
          const codeMirrorElement = document.querySelectorAll(
            ".react-codemirror2"
          )[1].firstChild;
          if (codeMirrorElement && codeMirrorElement.CodeMirror)
            codeMirrorElement.CodeMirror.setValue(queryParams.shapeMap);
        }

        queryParams.shapeMapURL && setShapeMap({...shapeMap, url: queryParams.shapeMapURL})
      }

      if (queryParams.endpoint)
        paramsEndpoint["endpoint"] = queryParams.endpoint;
      let params = {
        ...paramsData,
        ...paramsShEx,
        ...paramsShapeMap,
        ...paramsEndpoint,
      };

      setParams(params);
      setLastParams(params);
    }
  }, [props.location.search]);

  useEffect(() => {
    if (params && !loading) {
      if (!(params.data || params.dataURL || params.dataFile))
        setError("No RDF data provided");
      else if (!(params.schema || params.schemaURL || params.schemaFile))
        setError("No ShEx schema provided");
      else if (!(params.shapeMap || params.shapeMapURL || params.shapeMapFile))
        setError("No ShapeMap provided");
      else {
          console.log("DATA: ", data)
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

    const paramsEndpoint = {};
    if (endpoint !== "") {
      paramsEndpoint["endpoint"] = endpoint;
    }

    setParams({
      ...paramsFromStateData(data),
      ...paramsFromStateShEx(shex),
      ...paramsFromStateShapeMap(shapeMap),
      ...paramsEndpoint,
      schemaEngine: "ShEx",
      triggerMode: "shapeMap",
    });
  }

  function postValidate(cb) {
    setLoading(true);
    setProgressPercent(15);
    const formData = params2Form(params);
    setProgressPercent(30);

    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        setResult(data);
        setProgressPercent(70);
        setPermalink(await mkPermalink(API.shExValidateRoute, params));
        setProgressPercent(80);
        if (cb) cb();
        setProgressPercent(100);
      })
      .catch(function(error) {
        setError(
          `Error calling server at ${url}: ${error.message}.\n Try again later.`
        );
      })
      .finally(() => setLoading(false));
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
        mkPermalinkLong(API.shExValidateRoute, lastParams)
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.shExValidateRoute, params)
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
        <h1>Validate RDF data with ShEx</h1>
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkDataTabs(data, setData, "RDF input")}
            <Button
              variant="secondary"
              onClick={() => setWithEndpoint(!withEndpoint)}
            >
              {withEndpoint ? "Remove" : "Add"} endpoint
            </Button>
            {withEndpoint ? (
              <EndpointInput
                value={endpoint}
                handleOnChange={handleEndpointChange}
              />
            ) : null}
            <hr />
            {mkShExTabs(shex, setShEx, "Shapes graph (ShEx)")}
            <hr />
            {mkShapeMapTabs(shapeMap, setShapeMap, "ShapeMap")}
            <hr />
            <Button
              variant="primary"
              type="submit"
              className={"btn-with-icon " + (loading ? "disabled" : "")}
              disabled={loading}
            >
              Validate
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
                permalink={
                  !params.dataFile &&
                  !params.schemaFile &&
                  !params.shapeMapFile &&
                  permalink
                }
              />
            ) : null}
          </Col>
        ) : (
          <Col className={"half-col"}>
            <Alert variant="info">Validation results will appear here</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default ShExValidate;
