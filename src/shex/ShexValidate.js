import axios from "axios";
import qs from "query-string";
import React, { useContext, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import API from "../API";
import PageHeader from "../components/PageHeader";
import { ApplicationContext } from "../context/ApplicationContext";
import {
  getDataText,
  InitialData,
  mkDataTabs,
  paramsFromStateData,
  updateStateData
} from "../data/Data";
import EndpointInput from "../endpoint/EndpointInput";
import { mkPermalinkLong, params2Form } from "../Permalink";
import ResultSchemaValidate from "../results/ResultValidate";
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

function ShexValidate(props) {
  const [data, setData] = useState(InitialData);
  const [shex, setShEx] = useState(InitialShex);
  const [shapeMap, setShapeMap] = useState(InitialShapeMap);

  const [endpoint, setEndpoint] = useState("");
  const [withEndpoint, setWithEndpoint] = useState(false); // UI reference

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permalink, setPermalink] = useState(null);

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  // Get all required data from state: data, schema, shapemap
  const {
    rdfData: [ctxData],
    shexSchema: ctxShex,
    shapeMap: ctxShapeMap,
  } = useContext(ApplicationContext);

  const url = API.routes.server.schemaValidate;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);

      // Data from URL or default
      const finalData = {
        index: 0,
        ...(updateStateData(queryParams, data) || data),
      };
      setData(finalData);

      // Shex
      const finalShex = updateStateShex(queryParams, shex) || shex;
      setShEx(finalShex);

      // Shapemap
      const finalShapeMap =
        updateStateShapeMap(queryParams, shapeMap) || shapeMap;
      setShapeMap(finalShapeMap);

      // Endpoint
      const finalEndpoint =
        queryParams[API.queryParameters.endpoint.endpoint] || endpoint;
      setEndpoint(finalEndpoint);
      setWithEndpoint(!!finalEndpoint);

      const newParams = mkParams(
        finalData,
        finalShex,
        finalShapeMap,
        finalEndpoint
      );

      setParams(newParams);
      setLastParams(newParams);
    } else {
      if (ctxData && typeof ctxData === "object") setData(ctxData);
      if (ctxShex && typeof ctxShex === "object") setShEx(ctxShex);
      if (ctxShapeMap && typeof ctxShapeMap === "object")
        setShapeMap(ctxShapeMap);
    }
  }, [props.location?.search]);

  function mkParams(
    pData = data,
    pShex = shex,
    pShapeMap = shapeMap,
    pEndpoint = endpoint
  ) {
    const newParams = {
      ...paramsFromStateData(pData),
      ...paramsFromStateShex(pShex),
      ...paramsFromStateShapemap(pShapeMap), // + trigger mode
      [API.queryParameters.schema.targetEngine]: API.engines.shex, // Target is always ShEx
    };

    pEndpoint && (newParams[API.queryParameters.endpoint.endpoint] = pEndpoint);
    return newParams;
  }

  useEffect(() => {
    if (params) {
      const dataPresent =
        params[API.queryParameters.data.data] &&
        (params[API.queryParameters.data.source] == API.sources.byFile
          ? params[API.queryParameters.data.data].name
          : true);

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

      if (!dataPresent) setError(API.texts.noProvidedRdf);
      else if (!schemaPresent) setError(API.texts.noProvidedSchema);
      else if (!shapeMapPresent) setError(API.texts.noProvidedShapeMap);
      else {
        resetState();
        setUpHistory();
        postValidate();
      }
    }
  }, [params]);

  function handleSubmit(event) {
    event.preventDefault();

    setParams(mkParams());
  }

  async function postValidate() {
    setLoading(true);
    setProgressPercent(30);

    try {
      const postData = params2Form(params);
      const { data: validateResponse } = await axios.post(url, postData);
      setProgressPercent(60);

      setResult(validateResponse);
      setProgressPercent(80);

      setPermalink(
        mkPermalinkLong(API.routes.client.shexValidateRoute, params)
      );
      checkLinks();
    } catch (error) {
      setError(mkError(error, url));
    } finally {
      setLoading(false);
    }
  }

  // Disabled permalinks, etc. if the user input is too long or a file
  function checkLinks() {
    const disabled =
      getDataText(data).length +
        getShexText(shex).length +
        getShapeMapText(shapeMap).length >
      API.limits.byTextCharacterLimit
        ? API.sources.byText
        : data.activeSource === API.sources.byFile ||
          shex.activeSource === API.sources.byFile ||
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
        mkPermalinkLong(API.routes.client.shexValidateRoute, lastParams)
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.routes.client.shexValidateRoute, params)
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
        <PageHeader
          title={API.texts.pageHeaders.shexValidation}
          details={API.texts.pageExplanations.shexValidation}
        />
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkDataTabs(data, setData)}
            <Button
              variant="secondary"
              onClick={() => {
                setWithEndpoint(!withEndpoint);
                if (!withEndpoint === false) {
                  setEndpoint("");
                }
              }}
            >
              {withEndpoint ? "Remove" : "Add"} endpoint
            </Button>
            {withEndpoint ? (
              <EndpointInput
                value={endpoint}
                handleOnChange={(value) => setEndpoint(value.trim())}
              />
            ) : null}
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
              <ResultSchemaValidate
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

export default ShexValidate;
