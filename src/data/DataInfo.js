import axios from "axios";
import qs from "query-string";
import React, { Fragment, useContext, useEffect, useState } from "react";
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
import ResultDataInfo from "../results/ResultDataInfo";
import { processDotData } from "../utils/dot/dotUtils";
import { mkError } from "../utils/ResponseError";
import {
  getDataText, mkDataTabs,
  paramsFromStateData,
  updateStateData
} from "./Data";

function DataInfo(props) {
  // Recover user input data from context, if any. Use first item of the data array
  const {
    rdfData: [ctxData],
    addRdfData,
  } = useContext(ApplicationContext);

  // Set initial data from context, if possible
  const [data, setData] = useState(ctxData || addRdfData());

  const [result, setResult] = useState(null);

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permalink, setPermalink] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  const urlInfo = API.routes.server.dataInfo;
  const urlVisual = API.routes.server.dataConvert;

  // Try to autofill user data, first from the query string then from context
  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      if (queryParams[API.queryParameters.data.data]) {
        const finalData = {
          index: 0,
          ...(updateStateData(queryParams, data) || data),
        };
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
    if (params && !loading) {
      if (
        params[API.queryParameters.data.data] &&
        (params[API.queryParameters.data.source] == API.sources.byFile
          ? params[API.queryParameters.data.data].name
          : true) // Extra check for files
      ) {
        resetState();
        setUpHistory();
        postDataInfo();
      } else {
        setError(API.texts.noProvidedRdf);
      }
    }
  }, [params]);

  function handleSubmit(event) {
    event.preventDefault();
    setParams(paramsFromStateData(data));
  }

  async function postDataInfo() {
    setLoading(true);
    setProgressPercent(20);

    try {
      const infoForm = params2Form(params);
      // First: get data info with the data summary and prefix map
      const { data: resultInfo } = await axios.post(urlInfo, infoForm);
      setProgressPercent(40);

      // Second: get data visualizations...
      // ...first graphviz
      const graphvizForm = params2Form({
        ...params,
        [API.queryParameters.data.targetFormat]: API.formats.dot,
      });

      const { data: resultDot } = await axios.post(urlVisual, graphvizForm);
      const dot = resultDot.result.data; // Get the DOT string from the axios data object
      const dotVisualization = await processDotData(dot);
      setProgressPercent(60);

      // ...then cyto
      const cytoscapeForm = params2Form({
        ...params,
        [API.queryParameters.data.targetFormat]: API.formats.json,
      });
      const { data: resultCyto } = await axios.post(urlVisual, cytoscapeForm);
      const cytoElements = JSON.parse(resultCyto.result.data);

      setProgressPercent(80);

      // Set result with all collected data
      setResult({
        resultInfo,
        resultDot: { ...resultDot, visualization: dotVisualization },
        resultCyto: { ...resultCyto, elements: cytoElements },
      });
      // Set permalinks and finish
      setPermalink(mkPermalinkLong(API.routes.client.dataInfoRoute, params));
      checkLinks();
    } catch (err) {
      setError(mkError(error, urlInfo));
    } finally {
      setLoading(false);
    }
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
        mkPermalinkLong(API.routes.client.dataInfoRoute, lastParams)
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.routes.client.dataInfoRoute, params)
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
          title={API.texts.pageHeaders.dataInfo}
          details={API.texts.pageExplanations.dataInfo}
        />
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkDataTabs(data, setData)}
            <hr />
            <Button
              id="submit"
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
          <Fragment>
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
                <ResultDataInfo
                  result={result}
                  params={params}
                  permalink={permalink}
                  disabled={disabledLinks}
                />
              ) : null}
            </Col>
          </Fragment>
        ) : (
          <Col className={"half-col"}>
            <Alert variant="info">{API.texts.dataInfoWillAppearHere}</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default DataInfo;
