import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import qs from "query-string";
import React, { Fragment, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import { ZoomInIcon, ZoomOutIcon } from "react-open-iconic-svg";
import API from "../API";
import { mkPermalinkLong, params2Form, Permalink } from "../Permalink";
import ResultDataVisualize from "../results/ResultDataVisualize";
import { mkError } from "../utils/ResponseError";
import {
  visualizationMaxZoom,
  visualizationMinZoom,
  visualizationStepZoom
} from "../utils/Utils";
import { visualizationTypes } from "../visualization/ShowVisualization";
import {
  getDataText,
  InitialData,
  mkDataTabs,
  paramsFromStateData,
  updateStateData
} from "./Data";
import { convertDot } from "./dotUtils";

function DataVisualizeGraphviz(props) {
  const [data, setData] = useState(InitialData);

  const [result, setResult] = useState({});

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permalink, setPermalink] = useState(null);
  const [visualization, setVisualization] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [progressPercent, setProgressPercent] = useState(0);
  const [embedLink, setEmbedLink] = useState(null);
  const [disabledLinks, setDisabledLinks] = useState(false);

  const url = API.routes.server.dataConvert;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      if (queryParams[API.queryParameters.data.data]) {
        const finalData = updateStateData(queryParams, data) || data;
        setData(finalData);

        const params = paramsFromStateData(finalData);

        setParams(params);
        setLastParams(params);
      } else {
        setError(API.texts.errorParsingUrl);
      }
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params) {
      if (
        params[API.queryParameters.data.data] &&
        (params[API.queryParameters.data.source] == API.sources.byFile
          ? params[API.queryParameters.data.data].name
          : true) // Extra check for files
      ) {
        resetState();
        setUpHistory();
        postVisualize();
      } else {
        setError(API.texts.noProvidedRdf);
      }
      window.scrollTo(0, 0);
    }
  }, [params]);

  function handleSubmit(event) {
    event.preventDefault();
    setParams(paramsFromStateData(data));
  }

  function postVisualize(cb) {
    setLoading(true);
    const formData = params2Form(params);

    // The server internally converts to DOT and the client interprets that DOT as the user needs it (SVG, PNG...)
    formData.append(API.queryParameters.data.targetFormat, API.formats.dot);
    setProgressPercent(20);
    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        setResult(data);
        const dot = data.result.data; // Get the DOT string from the axios data object
        setProgressPercent(70);
        processDotData(dot, setError, setVisualization);
        setPermalink(
          mkPermalinkLong(API.routes.client.dataVisualizeGraphvizRoute, params)
        );
        setEmbedLink(
          mkPermalinkLong(
            API.routes.client.dataVisualizeGraphvizRouteRaw,
            params
          )
        );
        setProgressPercent(80);
        checkLinks();
        if (cb) cb();
        setProgressPercent(100);
      })
      .catch(function(error) {
        setError(mkError(error, url));
      })
      .finally(() => {
        setLoading(false);
        window.scrollTo(0, 0);
      });
  }

  // Disabled permalinks, etc. if the user input is too long or a file
  function checkLinks() {
    const disabled =
      getDataText(data).length > API.limits.byTextCharacterLimit
        ? API.sources.byText
        : data.activeSource === API.sources.byFile
        ? API.sources.byFile
        : false;

    setDisabledLinks(disabled);
  }

  function zoomSvg(zoomIn) {
    if (zoomIn) {
      const new_zoom = Math.min(
        visualizationMaxZoom,
        zoom + visualizationStepZoom
      );
      setZoom(new_zoom);
    } else {
      const new_zoom = Math.max(
        visualizationMinZoom,
        zoom - visualizationStepZoom
      );
      setZoom(new_zoom);
    }
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
        mkPermalinkLong(
          API.routes.client.dataVisualizeGraphvizRoute,
          lastParams
        )
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.routes.client.dataVisualizeGraphvizRoute, params)
    );

    setLastParams(params);
  }

  function resetState() {
    setVisualization(null);
    setZoom(1);
    setPermalink(null);
    setEmbedLink(null);
    setError(null);
    setProgressPercent(0);
  }

  return (
    <Container fluid={true}>
      <Row>
        <h1>{API.texts.pageHeaders.dataVisualization}</h1>
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form className={"width-100"} onSubmit={handleSubmit}>
            {mkDataTabs(data, setData)}
            <hr />
            <Button
              variant="primary"
              type="submit"
              className={"btn-with-icon " + (loading ? "disabled" : "")}
              disabled={loading}
            >
              {API.texts.actionButtons.visualize}
            </Button>
          </Form>
        </Col>
        {loading || error || visualization ? (
          <Col className="half-col visual-column">
            <Fragment>
              {permalink && !error ? (
                <div className={"d-flex"} style={{ flexWrap: "wrap" }}>
                  <Permalink url={permalink} disabled={disabledLinks} />
                  {!visualization?.textual && (
                    <>
                      <div className="divider"></div>
                      <Button
                        onClick={() => zoomSvg(false)}
                        className="btn-zoom"
                        variant="secondary"
                        disabled={zoom <= visualizationMinZoom}
                      >
                        <ZoomOutIcon className="white-icon" />
                      </Button>
                      <Button
                        onClick={() => zoomSvg(true)}
                        style={{ marginLeft: "1px" }}
                        className="btn-zoom"
                        variant="secondary"
                        disabled={zoom >= visualizationMaxZoom}
                      >
                        <ZoomInIcon className="white-icon" />
                      </Button>
                    </>
                  )}
                </div>
              ) : null}
              {loading ? (
                <ProgressBar
                  striped
                  animated
                  variant="info"
                  now={progressPercent}
                />
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : visualization && visualization.data ? (
                <ResultDataVisualize
                  result={result}
                  data={visualization.data}
                  type={visualizationTypes.svgObject}
                  raw={false}
                  zoom={zoom}
                  embedLink={embedLink}
                  disabledLinks={disabledLinks}
                />
              ) : null}
            </Fragment>
          </Col>
        ) : (
          <Col className={"half-col"}>
            <Alert variant="info">
              {API.texts.visualizationsWillAppearHere}
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export function processDotData(dot, setError, setVisualization) {
  convertDot(
    dot,
    API.formats.dot.toLowerCase(),
    API.formats.svg,
    setError,
    setVisualization
  );
}

export default DataVisualizeGraphviz;
