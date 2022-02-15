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
import { mkPermalinkLong, params2Form } from "../Permalink";
import ResultShapeMapInfo from "../results/ResultShapeMapInfo";
import { mkError } from "../utils/ResponseError";
import {
  InitialShapeMap,
  mkShapeMapTabs,
  paramsFromStateShapemap,
  updateStateShapeMap
} from "./ShapeMap";

function ShapeMapInfo(props) {
  const [shapemap, setShapemap] = useState(InitialShapeMap);
  const [result, setResult] = useState(null);
  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permalink, setPermalink] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  // Recover user shapeMap from context, if any
  const { shapeMap: ctxShapeMap } = useContext(ApplicationContext);

  const url = API.routes.server.shapeMapInfo;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      if (queryParams[API.queryParameters.shapeMap.shapeMap]) {
        const finalShapemap =
          updateStateShapeMap(queryParams, shapemap) || shapemap;
        setShapemap(finalShapemap);

        const params = mkParams(finalShapemap);
        setParams(params);
        setLastParams(params);
      } else setError(API.texts.errorParsingUrl);
    } else {
      if (ctxShapeMap && typeof ctxShapeMap === "object")
        setShapemap(ctxShapeMap);
    }
  }, [props.location?.search]);

  // Call API on params change
  useEffect(() => {
    if (params) {
      if (
        params[API.queryParameters.shapeMap.shapeMap] &&
        (params[API.queryParameters.shapeMap.source] == API.sources.byFile
          ? params[API.queryParameters.shapeMap.shapeMap].name
          : true) // Extra check for files
      ) {
        resetState();
        setUpHistory();
        postShapeMapInfo();
      } else {
        setError(API.texts.noProvidedShapeMap);
      }
    }
  }, [params]);

  async function handleSubmit(event) {
    event.preventDefault();
    setParams(mkParams());
  }

  function mkParams(paramsShapeMap = shapemap) {
    return { ...paramsFromStateShapemap(paramsShapeMap) };
  }

  function postShapeMapInfo(cb) {
    setLoading(true);
    setProgressPercent(20);
    const formData = params2Form(params);

    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        setResult(data);
        setProgressPercent(70);
        setPermalink(
          mkPermalinkLong(API.routes.client.shapeMapInfoRoute, params)
        );
        setProgressPercent(80);
        checkLinks();
        if (cb) cb();
        setProgressPercent(100);
      })
      .catch((error) => {
        console.error(error);
        setError(mkError(error, url));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Disabled permalinks, etc. if the user input is too long or a file
  function checkLinks() {
    const disabled =
      shapemap.activeSource === API.sources.byText &&
      shapemap.textArea.length > API.limits.byTextCharacterLimit
        ? API.sources.byText
        : shapemap.activeSource === API.sources.byFile
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
        mkPermalinkLong(API.routes.client.shapeMapInfoRoute, lastParams)
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.routes.client.shapeMapInfoRoute, params)
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
          title={API.texts.pageHeaders.shapeMapInfo}
          details={API.texts.pageExplanations.shapeMapInfo}
        />
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkShapeMapTabs(shapemap, setShapemap)}
            <hr />
            <Button
              variant="primary"
              type="submit"
              className={"btn-with-icon " + (loading ? "disabled" : "")}
              disabled={loading}
            >
              {API.texts.actionButtons.analyze}
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
              <ResultShapeMapInfo
                result={result}
                permalink={permalink}
                disabled={disabledLinks}
              />
            ) : null}
            {/*{ permalink && !error ? <Permalink url={permalink} />: null }*/}
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

export default ShapeMapInfo;
