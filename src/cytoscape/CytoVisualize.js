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
import API from "../API";
import Cyto from "../components/Cyto";
import {
    InitialData,
    mkDataTabs,
    paramsFromStateData,
    updateStateData
} from "../data/Data";
import {
    mkPermalink,
    mkPermalinkLong,
    params2Form,
    Permalink
} from "../Permalink";
import { dataParamsFromQueryParams } from "../utils/Utils";

function CytoVisualize(props) {
  const url = API.dataConvert;
  const cose = "cose";
  const circle = "circle";

  const [data, setData] = useState(InitialData);
  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permalink, setPermalink] = useState(null);
  const [elements, setElements] = useState(null);
  const [layoutName, setLayoutName] = useState(cose);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (props.location.search) {
      const queryParams = qs.parse(props.location.search);
      if (queryParams.data || queryParams.dataURL || queryParams.dataFile) {
        const dataParams = {
          ...dataParamsFromQueryParams(queryParams),
          targetDataFormat: "JSON",
        };
        setData(updateStateData(dataParams, data) || data);

        // Update text area correctly
        if (queryParams.data) {
          const codeMirror = document.querySelector(".react-codemirror2")
            .firstChild.CodeMirror;
          if (codeMirror) codeMirror.setValue(dataParams.data);
        }

        setParams(dataParams);
        setLastParams(dataParams);
      } else {
        setError("Could not parse URL data");
      }
    }
  }, [props.location.search]);

  useEffect(() => {
    if (params) {
      if (params.data || params.dataURL || params.dataFile) {
        resetState();
        setUpHistory();
        postConvert();
      } else {
        setError("No RDF data provided");
      }
      window.scrollTo(0, 0);
    }
  }, [params]);

  async function handleSubmit(event) {
    event.preventDefault();
    setParams(paramsFromStateData(data));
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
        setPermalink(await mkPermalink(API.cytoVisualizeRoute, params));
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
                <div className={"d-flex"}>
                  {!params.dataFile && <Permalink url={permalink} />}
                  <Button
                    onClick={() => setLayoutName(cose)}
                    className="btn-zoom"
                    variant="secondary"
                    disabled={layoutName === cose}
                  >
                    COSE layout
                  </Button>
                  <Button
                    onClick={() => setLayoutName(circle)}
                    style={{ marginLeft: "1px" }}
                    className="btn-zoom"
                    variant="secondary"
                    disabled={layoutName === circle}
                  >
                    Circle layout
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
                <Cyto
                  className={"width-100 height-100 border"}
                  layout={layoutName}
                  elements={elements}
                />
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

export default CytoVisualize;
