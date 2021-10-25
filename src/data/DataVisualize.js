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
import format from "xml-formatter";
import API from "../API";
import SelectFormat from "../components/SelectFormat";
import { mkPermalinkLong, params2Form, Permalink } from "../Permalink";
import ResponseError, { mkError } from "../utils/ResponseError";
import {
  dataParamsFromQueryParams,
  maxZoom,
  minZoom,
  stepZoom,
} from "../utils/Utils";
import ShowVisualization from "../visualization/ShowVisualization";
import VisualizationLinks from "../visualization/VisualizationLinks";
import {
  getDataText,
  InitialData,
  mkDataTabs,
  paramsFromStateData,
  updateStateData,
} from "./Data";
import { convertDot } from "./dotUtils";

function DataVisualize(props) {
  const [data, setData] = useState(InitialData);
  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permalink, setPermalink] = useState(null);
  const [targetGraphicalFormat] = useState(
    API.defaultGraphicalFormat
  );
  const [visualization, setVisualization] = useState(null);
  const [svgZoom, setSvgZoom] = useState(1);
  const [progressPercent, setProgressPercent] = useState(0);
  const [embedLink, setEmbedLink] = useState(null);
  const [disabledLinks, setDisabledLinks] = useState(false);

  const url = API.dataConvert;

  const minSvgZoom = minZoom;
  const maxSvgZoom = maxZoom;
  const svgZoomStep = stepZoom;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      if (queryParams.data || queryParams.dataUrl || queryParams.dataFile) {
        const dataParams = dataParamsFromQueryParams(queryParams);
        const finalData = updateStateData(dataParams, data) || data;
        setData(finalData);

        const params = {
          ...paramsFromStateData(finalData),
          targetGraphicalFormat
        };

        setParams(params);
        setLastParams(params);
      } else {
        setError("Could not parse URL data");
      }
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params) {
      if (
        params.data ||
        params.dataUrl ||
        (params.dataFile && params.dataFile.name)
      ) {
        resetState();
        setUpHistory();
        postVisualize();
      } else {
        setError("No RDF data provided");
      }
      window.scrollTo(0, 0);
    }
  }, [params]);

  function handleSubmit(event) {
    event.preventDefault();
    setParams({
      ...paramsFromStateData(data),
      targetGraphicalFormat
    });
  }

  function postVisualize(cb) {
    setLoading(true);
    const formData = params2Form(params);
    formData.append("targetDataFormat", "DOT"); // The server internally converts to DOT and the client interprets that DOT as the user needs it (SVG, PNG...)
    setProgressPercent(20);
    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        const dot = data.result.data; // Get the DOT string from the axios data object
        setProgressPercent(70);
        processData(dot, targetGraphicalFormat);
        setPermalink(mkPermalinkLong(API.dataVisualizeRoute, params));
        setEmbedLink(mkPermalinkLong(API.dataVisualizeRouteRaw, params));
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

  function processData(dot, targetFormat) {
    convertDot(dot, "dot", targetFormat, setError, setVisualization);
  }

  // Disabled permalinks, etc. if the user input is too long or a file
  function checkLinks() {
    const disabled =
      getDataText(data).length > API.byTextCharacterLimit
        ? API.byTextTab
        : data.activeTab === API.byFileTab
        ? API.byFileTab
        : false;

    setDisabledLinks(disabled);
  }

  function zoomSvg(zoomIn) {
    if (zoomIn) {
      const zoom = Math.min(maxSvgZoom, svgZoom + svgZoomStep);
      setSvgZoom(zoom);
    } else {
      const zoom = Math.max(minSvgZoom, svgZoom - svgZoomStep);
      setSvgZoom(zoom);
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
        mkPermalinkLong(API.dataVisualizeRoute, lastParams)
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.dataVisualizeRoute, params)
    );

    setLastParams(params);
  }

  function resetState() {
    setVisualization(null);
    setSvgZoom(1);
    setPermalink(null);
    setEmbedLink(null);
    setError(null);
    setProgressPercent(0);
  }

  return (
    <Container fluid={true}>
      <Row>
        <h1>Visualize RDF data</h1>
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form className={"width-100"} onSubmit={handleSubmit}>
            {mkDataTabs(data, setData, "RDF input")}
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
                        disabled={svgZoom <= minSvgZoom}
                      >
                        <ZoomOutIcon className="white-icon" />
                      </Button>
                      <Button
                        onClick={() => zoomSvg(true)}
                        style={{ marginLeft: "1px" }}
                        className="btn-zoom"
                        variant="secondary"
                        disabled={svgZoom >= maxSvgZoom}
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
                <div
                  style={{ position: "relative" }}
                  className="width-100 height-100 border"
                >
                  <VisualizationLinks
                    generateDownloadLink={generateDownloadLink(visualization)}
                    embedLink={embedLink}
                    disabled={disabledLinks}
                  />

                  <div
                    style={{ overflow: "auto" }}
                    className={"width-100 height-100"}
                  >
                    <ShowVisualization
                      data={visualization.data}
                      zoom={svgZoom}
                    />
                  </div>
                </div>
              ) : null}
            </Fragment>
          </Col>
        ) : (
          <Col className={"half-col"}>
            <Alert variant="info">Visualizations will appear here</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

// Receives a visualization
// Returns a function that returns the dowload link to the visualization
// Depends on the visualization type (SVG, PNG, textual...)
export const generateDownloadLink = ({ data }) => {
  if (!data) return;

  const visualizationType = Object.getPrototypeOf(data).toString();
  switch (visualizationType) {
    // SVG: data contains the SVG outer HTML
    case "[object SVGSVGElement]":
      return () => ({
        link: URL.createObjectURL(
          new Blob([data.outerHTML], {
            type: "image/svg+xml;charset=utf-8",
          })
        ),
        type: "svg",
      });

    // Image: data contains the image location
    case "[object HTMLImageElement]":
      return () => ({
        link: data.src,
        type: "png",
      });

    // JSON:
    case "[object Object]":
      return () => ({
        link: URL.createObjectURL(
          new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json;charset=utf-8",
          })
        ),
        type: "json",
      });
    // DOT, PS (String)
    default:
      return () => ({
        link: URL.createObjectURL(
          new Blob([format(data)], {
            type: "application/xml;charset=utf-8",
          })
        ),
        type: "xml",
      });
  }
};

export default DataVisualize;
