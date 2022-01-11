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
import { mkPermalinkLong, params2Form, Permalink } from "../Permalink";
import ResultDataVisualize from "../results/ResultDataVisualize";
import { mkError } from "../utils/ResponseError";
import { visualizationTypes } from "../visualization/ShowVisualization";
import {
  getDataText,
  InitialData,
  mkDataTabs,
  paramsFromStateData,
  updateStateData
} from "./Data";

// Common settings for cytoscape visualizations
export const cytoscapeMinZoom = 0.05;
export const cytoscapeMaxZoom = 3;
export const cytoSpacingFactor = 1;

// Cytoscape stylesheet for nodes and edges
export const stylesheetCytoscape = [
  {
    selector: "node",
    style: {
      "background-color": "orange",
      label: "data(label)",
    },
  },

  {
    selector: "edge",
    style: {
      width: 3,
      "line-color": "#ccc",
      "target-arrow-color": "#ccc",
      "target-arrow-shape": "triangle",
      label: "data(label)",
      "curve-style": "bezier",
      "control-point-step-size": 40,
    },
  },
];

// Cytoscape layouts available
export const breadthfirst = {
  name: "breadthfirst",
  uiName: "tree",
  fit: true,
  nodeDimensionsIncludeLabels: true,
  directed: false,
  spacingFactor: 1,
};
export const circle = {
  name: "circle",
  uiName: "circle",
  fit: true,
  nodeDimensionsIncludeLabels: true,
  directed: false,
  grid: true,
};
export const layouts = [breadthfirst, circle];

export const getLayoutByField = (fieldName, fieldValue) => {
  return layouts.find((layout) => layout[fieldName] == fieldValue);
};

export const getLayoutByName = (name) => getLayoutByField("name", name);
export const getLayoutByUIName = (name) => getLayoutByField("uiName", name);

function DataVisualizeCytoscape(props) {
  const url = API.routes.server.dataConvert;

  const [data, setData] = useState(InitialData);
  const [result, setResult] = useState({});

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [permalink, setPermalink] = useState(null);
  const [embedLink, setEmbedLink] = useState(null);

  // Data passed down to the visualization components
  const [visualizationData, setVisualizationData] = useState({});
  const [elements, setElements] = useState(null);
  const [layout, setLayout] = useState(breadthfirst);
  const refCyto = useRef(null);

  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      if (queryParams[API.queryParameters.data.data]) {
        const finalData = updateStateData(queryParams, data) || data;
        setData(finalData);

        if (queryParams[API.queryParameters.data.layout]) {
          const userLayout = getLayoutByUIName(
            queryParams[API.queryParameters.data.layout]
          );
          userLayout && setLayout(userLayout);
        }

        const params = {
          ...paramsFromStateData(finalData),
          [API.queryParameters.data.layout]:
            queryParams[API.queryParameters.data.layout] || layout.uiName,
        };

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

  // Update the data passed down to visualizations whenever needed
  useEffect(() => {
    setVisualizationData({
      layout,
      elements,
      refCyto,
    });
  }, [layout, elements, refCyto]);

  useEffect(() => {
    // Change links
    setPermalink(
      mkPermalinkLong(API.routes.client.dataVisualizeCytoscapeRoute, params)
    );
    setEmbedLink(
      mkPermalinkLong(API.routes.client.dataVisualizeCytoscapeRouteRaw, params)
    );
  }, [layout]);

  function handleSubmit(event) {
    event.preventDefault();
    setParams({
      ...paramsFromStateData(data),
      [API.queryParameters.data.layout]: layout.uiName,
    });
  }

  function postVisualize(cb) {
    setLoading(true);
    const formData = params2Form(params);
    formData.append(API.queryParameters.data.targetFormat, API.formats.json); // The server converts the data to JSON. The client later visualizes with Cytoscape
    setProgressPercent(20);

    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        setResult(data);
        setProgressPercent(70);

        /* Given the JSON data that the server returned, return the elements
        for the Cyto visualization */
        setElements(JSON.parse(data.result.data));

        setProgressPercent(80);
        setPermalink(
          mkPermalinkLong(API.routes.client.dataVisualizeCytoscapeRoute, params)
        );
        setEmbedLink(
          mkPermalinkLong(
            API.routes.client.dataVisualizeCytoscapeRouteRaw,
            params
          )
        );
        checkLinks();
        if (cb) cb();
        setProgressPercent(100);
      })
      .catch((error) => {
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
          API.routes.client.dataVisualizeCytoscapeRoute,
          lastParams
        )
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.routes.client.dataVisualizeCytoscapeRoute, params)
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
        <h1>{API.texts.pageHeaders.dataVisualization}</h1>
      </Row>
      <Row>
        <Col className="half-col border-right">
          <Form onSubmit={handleSubmit}>
            {mkDataTabs(data, setData)}
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
        {loading || elements || error ? (
          <Col className="half-col visual-column">
            <Fragment>
              {permalink && !error ? (
                <div className={"d-flex"} style={{ flexWrap: "wrap" }}>
                  <Permalink url={permalink} disabled={disabledLinks} />
                  <div className="divider"></div>
                  <Button
                    onClick={() => setLayout(breadthfirst)}
                    className="btn-zoom"
                    variant="secondary"
                    disabled={layout === breadthfirst}
                  >
                    {breadthfirst.uiName.toUpperCase()}
                  </Button>
                  <Button
                    onClick={() => setLayout(circle)}
                    style={{ marginLeft: "1px" }}
                    className="btn-zoom"
                    variant="secondary"
                    disabled={layout === circle}
                  >
                    {circle.uiName.toUpperCase()}
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
                <ResultDataVisualize
                  result={result}
                  data={visualizationData}
                  type={visualizationTypes.cytoscape}
                  raw={false}
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

export default DataVisualizeCytoscape;
