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
import { node } from "yashe/dist/yashe.bundled.min";
import API from "../API";
import { mkPermalinkLong, params2Form } from "../Permalink";
import ResultDataExtract from "../results/ResultDataExtract";
import NodeSelector from "../shex/NodeSelector";
import { mkError } from "../utils/ResponseError";
import {
  getDataText,
  InitialData,
  mkDataTabs,
  paramsFromStateData,
  updateStateData,
  dataParamsFromQueryParams,
} from "./Data";

function DataExtract(props) {
  const [data, setData] = useState(InitialData);
  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState("");
  const [permalink, setPermalink] = useState(null);
  const [nodeSelector, setNodeSelector] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  const url = API.dataExtract;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      if (queryParams.data) {
        const dataParams = dataParamsFromQueryParams(queryParams);

        setData(updateStateData(dataParams, data));

        if (queryParams.nodeSelector) setNodeSelector(queryParams.nodeSelector);

        setParams(queryParams);
        setLastParams(queryParams);
      } else setError("Could not parse URL data");
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params) {
      const dataPresent =
        params.data &&
        (params.dataSource == API.byFileSource ? params.data.name : true);

      const nodeSelectorPresent =
        nodeSelector && nodeSelector.trim().length > 0;

      if (dataPresent && nodeSelectorPresent) {
        resetState();
        setUpHistory();
        postExtract();
      } else if (!dataPresent) {
        setError("No RDF data provided");
      } else if (!nodeSelectorPresent) {
        setError("No node selector provided");
      }
      window.scrollTo(0, 0);
    }
  }, [params]);

  async function handleSubmit(event) {
    event.preventDefault();
    setParams({
      ...paramsFromStateData(data),
      nodeSelector,
    });
  }

  function postExtract(cb) {
    setLoading(true);
    const formData = params2Form(params);
    setProgressPercent(20);
    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        setProgressPercent(60);
        setResult(data);
        setPermalink(mkPermalinkLong(API.dataExtractRoute, params));
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
      getDataText(data).length > API.byTextCharacterLimit
        ? API.byTextSource
        : data.activeSource === API.byFileSource
        ? API.byFileSource
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
        mkPermalinkLong(API.dataExtractRoute, lastParams)
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.dataExtractRoute, params)
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
        <h1>Extract ShEx from data</h1>
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkDataTabs(data, setData, "RDF input")}
            <NodeSelector
              value={nodeSelector}
              handleChange={(value) => setNodeSelector(value.trim())}
            />
            <hr />
            <Button
              variant="primary"
              type="submit"
              className={"btn-with-icon " + (loading ? "disabled" : "")}
              disabled={loading}
            >
              Extract schema
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
                  permalink={permalink}
                  disabled={disabledLinks}
                />
              ) : null}
            </Fragment>
          </Col>
        ) : (
          <Col className={"half-col"}>
            <Alert variant="info">Extraction results will appear here</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default DataExtract;
