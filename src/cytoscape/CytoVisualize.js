import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import qs from "query-string";
import React, { Fragment, useEffect, useRef, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import API from "../API";
import Cyto from "../components/Cyto";
import {
  getDataText,
  InitialData,
  mkDataTabs,
  paramsFromStateData,
  updateStateData
} from "../data/Data";
import { mkPermalinkLong, params2Form, Permalink } from "../Permalink";
import { dataParamsFromQueryParams } from "../utils/Utils";
import VisualizationLinks from "../visualization/VisualizationLinks";

function CytoVisualize(props) {
  const url = API.dataConvert;
  const cose = "cose";
  const circle = "circle";
  const layouts = [cose, circle];

  const refCyto = useRef(null);
  const [data, setData] = useState(InitialData);
  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permalink, setPermalink] = useState(null);
  const [embedLink, setEmbedLink] = useState(null);
  const [elements, setElements] = useState(null);
  const [layout, setLayout] = useState(cose);
  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      if (queryParams.data || queryParams.dataURL || queryParams.dataFile) {
        const dataParams = dataParamsFromQueryParams(queryParams);
        const paramsData = updateStateData(dataParams, data) || data;
        setData(paramsData);

        if (queryParams.layout && layouts.includes(queryParams.layout)) {
          setLayout(queryParams.layout);
        }

        const params = {
          ...paramsFromStateData(paramsData),
          targetDataFormat: "JSON",
          layout: queryParams.layout || layout,
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
        params.dataURL ||
        (params.dataFile && params.dataFile.name)
      ) {
        resetState();
        setUpHistory();
        postConvert();
      } else {
        setError("No RDF data provided");
      }
      window.scrollTo(0, 0);
    }
  }, [params]);

  useEffect(() => {
    setPermalink(
      mkPermalinkLong(API.cytoVisualizeRoute, { ...params, layout })
    );
    setEmbedLink(
      mkPermalinkLong(API.cytoVisualizeRouteRaw, { ...params, layout })
    );
  }, [layout]);

  async function handleSubmit(event) {
    event.preventDefault();
    setParams({ ...paramsFromStateData(data), layout });
  }

  function postConvert(cb) {
    setLoading(true);
    const formData = params2Form(params);
    formData.append("targetDataFormat", "JSON"); // Converts to JSON elements which are visualized by Cytoscape
    setProgressPercent(20);
    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        setProgressPercent(70);
        processData(data);
        setProgressPercent(80);
        setPermalink(mkPermalinkLong(API.cytoVisualizeRoute, params));
        setEmbedLink(mkPermalinkLong(API.cytoVisualizeRouteRaw, params));
        checkLinks();
        if (cb) cb();
        setProgressPercent(100);
      })
      .catch((error) => setError(error.toString()))
      .finally(() => {
        setLoading(false);
        window.scrollTo(0, 0);
      });
  }

  function processData(data) {
    if (data.error) setError(data.error);
    else {
      const elements = JSON.parse(data.result);
      setElements(elements);
    }
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
        mkPermalinkLong(API.cytoVisualizeRoute, lastParams)
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.cytoVisualizeRoute, params)
    );
    setLastParams(params);
  }

  function resetState() {
    setElements(null);
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
          <Form onSubmit={handleSubmit}>
            {mkDataTabs(data, setData, "RDF input")}
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
        {loading || elements || error ? (
          <Col className="half-col visual-column">
            <Fragment>
              {permalink && !error ? (
                <div className={"d-flex"} style={{ flexWrap: "wrap" }}>
                  <Permalink url={permalink} disabled={disabledLinks} />
                  <div className="divider"></div>
                  <Button
                    onClick={() => setLayout(cose)}
                    className="btn-zoom"
                    variant="secondary"
                    disabled={layout === cose}
                  >
                    COSE
                  </Button>
                  <Button
                    onClick={() => setLayout(circle)}
                    style={{ marginLeft: "1px" }}
                    className="btn-zoom"
                    variant="secondary"
                    disabled={layout === circle}
                  >
                    Circle
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
              ) : elements ? (
                <div
                  style={{ position: "relative" }}
                  className="cyto-container border"
                >
                  <VisualizationLinks
                    generateDownloadLink={generateDownloadLink(refCyto)}
                    embedLink={embedLink}
                    disabled={disabledLinks}
                  />

                  <Cyto layout={layout} elements={elements} refCyto={refCyto} />
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

export const generateDownloadLink = (refCyto) => {
  if (!refCyto) return;

  return () => {
    if (!refCyto.current) return;

    const svg = refCyto.current.svg({
      full: true,
    });

    return {
      link: URL.createObjectURL(
        new Blob([svg], {
          type: "image/svg+xml;charset=utf-8",
        })
      ),
      type: "svg",
    };
  };
};

export default CytoVisualize;
