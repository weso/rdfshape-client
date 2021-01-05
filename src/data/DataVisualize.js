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
import ImageIcon from "react-open-iconic-svg/dist/ImageIcon";
import API from "../API";
import SelectFormat from "../components/SelectFormat";
import { mkPermalinkLong, params2Form, Permalink } from "../Permalink";
import { dataParamsFromQueryParams } from "../utils/Utils";
import ShowVisualization from "../visualization/ShowVisualization";
import {
  getDataText,
  InitialData,
  mkDataTabs,
  paramsFromStateData,
  updateStateData
} from "./Data";
import { convertDot } from "./dotUtils";

function DataVisualize(props) {
  const [data, setData] = useState(InitialData);
  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permalink, setPermalink] = useState(null);
  const [targetGraphFormat, setTargetGraphFormat] = useState("SVG");
  const [visualization, setVisualization] = useState(null);
  const [svgZoom, setSvgZoom] = useState(1);
  const [progressPercent, setProgressPercent] = useState(0);
  const [imageLink, setImageLink] = useState(null);

  const url = API.dataConvert;

  const minSvgZoom = API.minSvgZoom;
  const maxSvgZoom = API.maxSvgZoom;
  const svgZoomStep = API.svgZoomStep;

  function handleTargetGraphFormatChange(value) {
    setTargetGraphFormat(value);
  }

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      if (queryParams.data || queryParams.dataURL || queryParams.dataFile) {
        const dataParams = dataParamsFromQueryParams(queryParams);
        const paramsData = updateStateData(dataParams, data) || data;
        setData(paramsData);

        if (queryParams.targetDataFormat) {
          setTargetGraphFormat(queryParams.targetDataFormat);
        }

        const params = {
          ...paramsFromStateData(paramsData),
          targetGraphFormat: queryParams.targetDataFormat || undefined,
          targetDataFormat: queryParams.targetDataFormat || undefined,
        };

        setParams(params);
        setLastParams(params);
      } else {
        setError("Could not parse URL data");
      }
    }
  }, [props.location?.search]);
  //localhost:3000/dataVisualizeRaw?activeTab=%23dataTextArea&data=%40prefix%20%3A%20%20%20%20%20%20%3Chttp%3A%2F%2Fexample.org%2F%3E%20.%0A%40prefix%20schema%3A%20%3Chttp%3A%2F%2Fschema.org%2F%3E%20.%0A%40prefix%20item%3A%20%20%3Chttp%3A%2F%2Fdata.europeana.eu%2Fitem%2F04802%2F%3E%20.%0A%40prefix%20dbr%3A%20%20%20%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2F%3E%20.%0A%40prefix%20xsd%3A%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%20.%0A%40prefix%20dcterms%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%20.%0A%40prefix%20it%3A%20%20%20%20%3Chttp%3A%2F%2Fdata.example.org%2Fitem%2F%3E%20.%0A%40prefix%20wd%3A%20%20%20%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2F%3E%20.%0A%40prefix%20foaf%3A%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%20.%0A%0A%3Aalice%20%20a%20%20%20%20%20%20%20foaf%3APerson%20.%0A%0A%3Abob%20%20%20%20a%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20foaf%3APerson%20%3B%0A%20%20%20%20%20%20%20%20schema%3AbirthDate%20%20%20%20%20%221990-07-04%22%5E%5Exsd%3Adate%20%3B%0A%20%20%20%20%20%20%20%20foaf%3Aknows%20%20%20%20%20%20%20%20%20%20%20%3Chttp%3A%2F%2Fexample.org%2Falice%23me%3E%20%3B%0A%20%20%20%20%20%20%20%20foaf%3Atopic_interest%20%20wd%3AQ12418%20.%0A%0A%3Acarol%20%20a%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20foaf%3APerson%20%3B%0A%20%20%20%20%20%20%20%20schema%3AbirthDate%20%20%22unknown%22%20.%0A%0Awd%3AQ12418%20%20dcterms%3Acreator%20%20dbr%3ALeonardo_da_Vinci%20%3B%0A%20%20%20%20%20%20%20%20dcterms%3Atitle%20%20%20%20%22Mona%20Lisa%22%20.%0A%0Ait%3A243FA%20%20dcterms%3Asubject%20%20wd%3AQ12418%20%3B%0A%20%20%20%20%20%20%20%20dcterms%3Atitle%20%20%20%20%22La%20Joconde%20%C3%A0%20Washington%22%40fr%20.&dataFormat=TURTLE&dataFormatTextArea=TURTLE&inference=None&targetDataFormat=PNG&targetGraphFormat=PNG
  http: useEffect(() => {
    if (params) {
      if (
        params.data ||
        params.dataURL ||
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
      targetGraphFormat,
      targetDataFormat: targetGraphFormat,
    });
  }

  function postVisualize(cb) {
    setLoading(true);
    const formData = params2Form(params);
    formData.append("targetDataFormat", "dot"); // It converts to dot in the server
    setProgressPercent(20);
    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        setProgressPercent(70);
        processData(data, targetGraphFormat);
        setPermalink(mkPermalinkLong(API.dataVisualizeRoute, params));
        setImageLink(mkPermalinkLong(API.dataVisualizeRouteRaw, params));
        setProgressPercent(80);
        if (cb) cb();
        setProgressPercent(100);
      })
      .catch(function(error) {
        setError(`Error response from ${url}: ${error.message.toString()}`);
      })
      .finally(() => {
        setLoading(false);
        window.scrollTo(0, 0);
      });
  }

  function processData(d, targetFormat) {
    convertDot(d.result, "dot", targetFormat, setError, setVisualization);
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
    setImageLink(null);
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
            <SelectFormat
              name="Target visualization format"
              handleFormatChange={handleTargetGraphFormatChange}
              urlFormats={API.dataVisualFormats}
              selectedFormat={targetGraphFormat}
            />

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
                  <Permalink
                    url={permalink}
                    disabled={
                      getDataText(data).length > API.byTextCharacterLimit
                        ? API.byTextTab
                        : data.activeTab === API.byFileTab
                        ? API.byFileTab
                        : false
                    }
                  />
                  {!visualization?.textual && (
                    <>
                      {imageLink && (
                        <Permalink
                          style={{ marginLeft: "5px" }}
                          icon={<ImageIcon className="white-icon" />}
                          shorten={false}
                          text={"Embed"}
                          url={imageLink}
                          disabled={
                            getDataText(data).length > API.byTextCharacterLimit
                              ? API.byTextTab
                              : data.activeTab === API.byFileTab
                              ? API.byFileTab
                              : false
                          }
                        />
                      )}
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
                  style={{ overflow: "auto", zoom: svgZoom }}
                  className={"width-100 height-100 border"}
                >
                  <ShowVisualization data={visualization.data} />
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

export default DataVisualize;
