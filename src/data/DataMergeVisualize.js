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
import { ZoomInIcon, ZoomOutIcon } from "react-open-iconic-svg";
import API from "../API";
import {
  mkPermalink,
  mkPermalinkLong,
  params2Form,
  Permalink
} from "../Permalink";
import ShowSVG from "../svg/ShowSVG";
import {
  InitialData,
  mkDataTabs,
  paramsFromStateData,
  updateStateData
} from "./Data";
import { convertDot } from "./dotUtils";

function DataMergeVisualize(props) {
  const [data1, setData1] = useState(InitialData);
  const [data2, setData2] = useState(InitialData);
  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);
  const [targetDataFormat] = useState("dot");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permalink, setPermalink] = useState(null);
  const [svg, setSVG] = useState(null);
  const [svgZoom, setSvgZoom] = useState(1);
  const [progressPercent, setProgressPercent] = useState(0);

  const url = API.dataConvert;

  const minSvgZoom = 0.2;
  const maxSvgZoom = 1.9;
  const svgZoomStep = 0.1;

  useEffect(() => {
    if (props.location.search) {
      const queryParams = qs.parse(props.location.search);
      if (queryParams.compoundData) {
        try {
          const contents = JSON.parse(queryParams.compoundData);

          const newData1 = updateStateData(contents[0], data1) || data1;
          const newData2 = updateStateData(contents[1], data2) || data2;

          setData1(newData1);
          setData2(newData2);

          setParams(queryParams);
          setLastParams(queryParams);
        } catch {
          setError("Could not parse URL data");
        }
      } else {
        setError("Could not parse URL data");
      }
    }
  }, [props.location.search]);

  useEffect(() => {
    if (params && params.compoundData) {
      const parameters = JSON.parse(params.compoundData);
      if (parameters.some((p) => p.data || p.dataURL || p.dataFile)) {
        // Check if some data was uploaded
        resetState();
        setUpHistory();
        postVisualize();
      } else {
        setError("No RDF data provided");
      }
      window.scrollTo(0, 0);
    }
  }, [params]);

  function mergeParams(params1, params2) {
    return { compoundData: JSON.stringify([params1, params2]) };
  }

  function processData(d, targetFormat) {
    convertDot(d.result, "dot", "SVG", setLoading, setError, setSVG);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    let params1 = paramsFromStateData(data1);
    let params2 = paramsFromStateData(data2);
    setParams({ ...mergeParams(params1, params2), targetDataFormat }); // It converts to dot in the server
  }

  function postVisualize(cb) {
    setLoading(true);
    setProgressPercent(15);
    const formData = params2Form(params);
    setProgressPercent(35);
    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        setProgressPercent(70);
        processData(data);
        setPermalink(await mkPermalink(API.dataMergeVisualize, params));
        setProgressPercent(80);
        if (cb) cb();
        setProgressPercent(100);
      })
      .catch(function(error) {
        setError(`Error doing request to ${url}: ${error.message}`);
      })
      .finally(() => {
        setLoading(false);
        window.scrollTo(0, 0);
      });
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
        mkPermalinkLong(API.dataMergeVisualize, lastParams)
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.dataMergeVisualize, params)
    );

    setLastParams(params);
  }

  function resetState() {
    setSVG(null);
    setSvgZoom(1);
    setPermalink(null);
    setError(null);
    setProgressPercent(0);
  }

  return (
    <Container fluid={true}>
      <Row>
        <h1>Merge & visualize RDF data</h1>
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkDataTabs(data1, setData1, "RDF Input 1")}
            <hr />
            {mkDataTabs(data2, setData2, "RDF Input 2")}
            <hr />
            <Button
              id="submit"
              variant="primary"
              type="submit"
              className={"btn-with-icon " + (loading ? "disabled" : "")}
              disabled={loading}
            >
              Merge & visualize
            </Button>
          </Form>
        </Col>
        {loading || error || svg ? (
          <Col className="half-col visual-column">
            <Fragment>
              {permalink && !error ? (
                <div className={"d-flex"}>
                  <Permalink
                    url={permalink}
                    disabled={
                      (data1.activeTab == API.byTextTab ||
                        data2.activeTab == API.byTextTab) &&
                      data1.textArea.length + data2.textArea.length >
                        API.byTextCharacterLimit
                        ? API.byTextTab
                        : data1.activeTab == API.byFileTab ||
                          data2.activeTab == API.byFileTab
                        ? API.byFileTab
                        : false
                    }
                  />
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
              ) : svg && svg.svg ? (
                <div
                  style={{ overflow: "auto", zoom: svgZoom }}
                  className={"width-100 height-100 border"}
                >
                  <ShowSVG svg={svg.svg} />
                </div>
              ) : null}
            </Fragment>
          </Col>
        ) : (
          <Col className={"half-col"}>
            <Alert variant="info">Merge results will appear here</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default DataMergeVisualize;
