import axios from "axios";
import qs from "query-string";
import React, { Fragment, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import ZoomInIcon from "react-open-iconic-svg/dist/ZoomInIcon";
import ZoomOutIcon from "react-open-iconic-svg/dist/ZoomOutIcon";
import API from "../API";
import { mkPermalinkLong, params2Form, Permalink } from "../Permalink";
import ResultShexVisualize from "../results/ResultShexVisualizeUml";
import { mkError } from "../utils/ResponseError";
import {
  visualizationMaxZoom,
  visualizationMinZoom,
  visualizationStepZoom
} from "../utils/Utils";
import { visualizationTypes } from "../visualization/ShowVisualization";
import {
  getShexText,
  InitialShex,
  mkShexTabs,
  paramsFromStateShex,
  updateStateShex
} from "./Shex";

function ShexVisualizeUml(props) {
  const [shex, setShex] = useState(InitialShex);

  const [result, setResult] = useState("");

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [permalink, setPermalink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [progressPercent, setProgressPercent] = useState(0);
  const [embedLink, setEmbedLink] = useState(null);

  const [disabledLinks, setDisabledLinks] = useState(false);

  const url = API.routes.server.schemaConvert;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);

      if (queryParams[API.queryParameters.schema.schema]) {
        const finalSchema = updateStateShex(queryParams, shex) || shex;
        setShex(finalSchema);

        const params = mkParams(finalSchema);
        setParams(params);
        setLastParams(params);
      } else {
        setError(API.texts.errorParsingUrl);
      }
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params && !loading) {
      if (
        params[API.queryParameters.schema.schema] &&
        (params[API.queryParameters.schema.source] == API.sources.byFile
          ? params[API.queryParameters.schema.schema].name
          : true)
      ) {
        resetState();
        setUpHistory();
        postVisualize();
      } else {
        setError(API.texts.noProvidedSchema);
      }
      window.scrollTo(0, 0);
    }
  }, [params]);

  function handleSubmit(event) {
    event.preventDefault();
    setParams(mkParams());
  }

  function mkParams(shexParams = shex) {
    return {
      ...paramsFromStateShex(shexParams),
      // The server internally converts to a PlantUML SVG string and the client interprets it
      [API.queryParameters.schema.targetFormat]: API.formats.svg,
    };
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

  function postVisualize(cb) {
    setLoading(true);
    setProgressPercent(20);
    const formData = params2Form(params);

    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        setProgressPercent(70);
        setResult(data);
        setPermalink(
          mkPermalinkLong(API.routes.client.shexVisualizeUmlRoute, params)
        );
        setEmbedLink(
          mkPermalinkLong(API.routes.client.shexVisualizeUmlRouteRaw, params)
        );
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
      getShexText(shex).length > API.limits.byTextCharacterLimit
        ? API.sources.byText
        : shex.activeSource === API.sources.byFile
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
        mkPermalinkLong(API.routes.client.shexVisualizeUmlRoute, lastParams)
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.routes.client.shexVisualizeUmlRoute, params)
    );

    setLastParams(params);
  }

  function resetState() {
    setResult(null);
    setPermalink(null);
    setEmbedLink(null);
    setError(null);
    setProgressPercent(0);
  }

  return (
    <Container fluid={true}>
      <Row>
        <h1>{API.texts.pageHeaders.shexVisualization}</h1>
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkShexTabs(shex, setShex)}
            <hr />
            <Button
              variant="primary"
              type="submit"
              className={"btn-with-icon " + (loading ? "disabled" : "")}
              disabled={loading}
            >
              Visualize
            </Button>
          </Form>
        </Col>
        {loading || result || permalink || error ? (
          <Col className="half-col visual-column">
            <Fragment>
              {permalink && !error ? (
                <div className={"d-flex"} style={{ flexWrap: "wrap" }}>
                  <Permalink url={permalink} disabled={disabledLinks} />
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
              ) : result ? (
                <ResultShexVisualize
                  result={result}
                  type={visualizationTypes.svgRaw}
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

export default ShexVisualizeUml;
