import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
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
import ResultDataExtract from "../results/ResultDataExtract";
import NodeSelector from "../shex/NodeSelector";
import { mkError } from "../utils/ResponseError";
import {
  getDataText, mkDataTabs,
  paramsFromStateData,
  updateStateData
} from "./Data";
import { getNodesFromForm } from "./TurtleForm";

function DataExtract(props) {
  // Recover user input data and query from context, if any. Use first item of the data array
  const {
    rdfData: [ctxData],
    addRdfData,
  } = useContext(ApplicationContext);

  const [data, setData] = useState(ctxData || addRdfData());
  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState("");
  const [permalink, setPermalink] = useState(null);

  const [nodeSelectorList, setNodeSelectorList] = useState([]); // Pre-defined choices in the node selector
  const [nodeSelector, setNodeSelector] = useState("");

  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  const urlServerExtract = API.routes.server.dataExtract;
  const urlServerVisualize = API.routes.server.schemaConvert;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      if (queryParams[API.queryParameters.data.data]) {
        const finalData = { index: 0, ...updateStateData(queryParams, data) };
        setData(finalData);

        const finalNodeSelector =
          queryParams[API.queryParameters.data.nodeSelector] || nodeSelector;
        setNodeSelector(finalNodeSelector);

        const newParams = mkParams(finalData, finalNodeSelector);

        setParams(newParams);
        setLastParams(newParams);
      } else setError(API.texts.errorParsingUrl);
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params) {
      // Do not send request if missing data or node selector
      const dataPresent =
        params[API.queryParameters.data.data] &&
        (params[API.queryParameters.data.source] == API.sources.byFile
          ? params[API.queryParameters.data.data].name
          : true);

      const nodeSelectorPresent = !!params[
        API.queryParameters.extraction.nodeSelector
      ]?.trim();

      if (dataPresent && nodeSelectorPresent) {
        resetState();
        setUpHistory();
        postExtract();
      } else if (!dataPresent) {
        setError(API.texts.noProvidedRdf);
      } else if (!nodeSelectorPresent) {
        setError("No node selector provided");
      }
    }
  }, [params]);

  async function handleSubmit(event) {
    event.preventDefault();
    setParams({
      ...paramsFromStateData(data),
      [API.queryParameters.data.nodeSelector]: nodeSelector,
    });
  }

  function mkParams(pData = data, pNodeSelector = nodeSelector) {
    return {
      ...paramsFromStateData(pData),
      [API.queryParameters.extraction.nodeSelector]: pNodeSelector.trim(),
    };
  }

  async function postExtract() {
    setLoading(true);
    setProgressPercent(20);

    try {
      // First: extract schema
      const schemaExtractParams = params2Form(params);
      const { data: schemaExtractResponse } = await axios.post(
        urlServerExtract,
        schemaExtractParams
      );
      setProgressPercent(60);

      // Then, get schema visualization for the extracted schema
      const schemaVisualizeParams = params2Form({
        [API.queryParameters.schema.schema]:
          schemaExtractResponse.result.schema,
        [API.queryParameters.schema.format]: API.formats.shexc,
        [API.queryParameters.schema.engine]: API.engines.shex,
        [API.queryParameters.schema.source]: API.sources.byText,
        [API.queryParameters.schema.targetFormat]: API.formats.svg,
      });
      const { data: schemaVisualizeResponse } = await axios.post(
        urlServerVisualize,
        schemaVisualizeParams
      );
      setProgressPercent(80);

      // Set the result with the extracted and visual data
      setResult({
        extractResponse: schemaExtractResponse,
        visualizeResponse: schemaVisualizeResponse,
      });

      // Set permalinks and finish
      setPermalink(mkPermalinkLong(API.routes.client.dataExtractRoute, params));
      checkLinks();
    } catch (err) {
      setError(mkError(error, urlServerExtract));
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
        mkPermalinkLong(API.routes.client.dataExtractRoute, lastParams)
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.routes.client.dataExtractRoute, params)
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
          title={API.texts.pageHeaders.dataShexExtraction}
          details={API.texts.pageExplanations.dataShexExtraction}
        />
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkDataTabs(
              data,
              setData,
              API.texts.dataTabs.dataHeader,
              "",
              (value, y, change) => setNodeSelectorList(getNodesFromForm(y))
            )}
            <NodeSelector
              // Clear node selector list if the new data source is not by text
              options={
                data.activeSource === API.sources.byText ? nodeSelectorList : []
              }
              selected={[nodeSelector]}
              handleChange={([node]) =>
                node && setNodeSelector(node?.customOption ? node.label : node)
              }
              handleInputChange={(value) => setNodeSelector(value)}
            />
            <hr />
            <Button
              variant="primary"
              type="submit"
              className={"btn-with-icon " + (loading ? "disabled" : "")}
              disabled={loading}
            >
              {API.texts.actionButtons.extract}
            </Button>
          </Form>
        </Col>

        {loading || result || error || permalink ? (
          <Col className={"half-col"}>
            <Fragment>
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
                <ResultDataExtract
                  result={result}
                  params={params}
                  permalink={permalink}
                  disabled={disabledLinks}
                />
              ) : null}
            </Fragment>
          </Col>
        ) : (
          <Col className={"half-col"}>
            <Alert variant="info">
              {API.texts.extractionResultsWillAppearHere}
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default DataExtract;
