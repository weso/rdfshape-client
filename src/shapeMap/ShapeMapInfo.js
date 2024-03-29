import qs from "query-string";
import React, { useContext, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import { useHistory } from "react-router";
import API from "../API";
import PageHeader from "../components/PageHeader";
import { ApplicationContext } from "../context/ApplicationContext";
import { mkPermalinkLong } from "../Permalink";
import ResultShapeMapInfo from "../results/ResultShapeMapInfo";
import axios from "../utils/networking/axiosConfig";
import { mkError } from "../utils/ResponseError";
import {
  InitialShapeMap,
  mkShapeMapServerParams,
  mkShapeMapTabs,
  paramsFromStateShapeMap,
  updateStateShapeMap
} from "./ShapeMap";

function ShapeMapInfo(props) {
  // Recover user shapeMap from context, if any
  const { shapeMap: ctxShapeMap } = useContext(ApplicationContext);

  const history = useHistory();

  const [shapemap, setShapemap] = useState(ctxShapeMap || InitialShapeMap);

  const [result, setResult] = useState(null);

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permalink, setPermalink] = useState(null);

  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

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

  function mkParams(pShapeMap = shapemap) {
    return { ...paramsFromStateShapeMap(pShapeMap) };
  }

  // Make request params from state params
  async function mkServerParams(pShapeMap = shapemap) {
    const source = pShapeMap[API.queryParameters.shapeMap.source];
    return {
      [API.queryParameters.shapeMap.shapeMap]: await mkShapeMapServerParams(
        pShapeMap
      ),
    };
  }

  async function postShapeMapInfo() {
    setLoading(true);
    setProgressPercent(20);

    try {
      const { data } = await axios.post(url, await mkServerParams());
      setResult(data);
      setProgressPercent(70);
      setPermalink(
        mkPermalinkLong(API.routes.client.shapeMapInfoRoute, params, true)
      );
      setProgressPercent(80);
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
      history.push(
        mkPermalinkLong(API.routes.client.shapeMapInfoRoute, lastParams)
      );
    }
    // Change current url for shareable links
    history.replace(
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
