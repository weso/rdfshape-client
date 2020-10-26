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
import {
    mkPermalink,
    mkPermalinkLong,
    params2Form,
    Permalink
} from "../Permalink";
import {
    InitialQuery,
    mkQueryTabs,
    paramsFromStateQuery,
    queryParamsFromQueryParams,
    updateStateQuery
} from "../query/Query";
import ResultEndpointQuery from "../results/ResultEndpointQuery";
import { dataParamsFromQueryParams } from "../utils/Utils";
import {
    InitialData,
    mkDataTabs,
    paramsFromStateData,
    updateStateData
} from "./Data";

function DataQuery(props) {
  const [data, setData] = useState(InitialData);
  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);
  const [result, setResult] = useState(null);
  const [query, setQuery] = useState(InitialQuery);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permalink, setPermalink] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);

  const url = API.dataQuery;

  useEffect(() => {
    if (props.location.search) {
      const queryParams = qs.parse(props.location.search);
      if (
        (queryParams.data || queryParams.dataURL || queryParams.dataFile) &&
        (queryParams.query || queryParams.queryURL || queryParams.queryFile)
      ) {
        const dataParams = {
          ...dataParamsFromQueryParams(queryParams),
          ...queryParamsFromQueryParams(queryParams),
        };
        setData(updateStateData(dataParams, data) || data);
        setQuery(updateStateQuery(dataParams, query) || query);

        // Update text areas correctly
        const codemirrors = document.querySelectorAll(".react-codemirror2");
        if (codemirrors.length > 0) {
          if (queryParams.data && codemirrors[0]) {
            const cm = codemirrors[0].firstChild.CodeMirror;
            if (cm) cm.setValue(queryParams.data);
          }
          if (queryParams.query && codemirrors[1]) {
            const cm = codemirrors[1].firstChild.CodeMirror;
            if (cm) cm.setValue(queryParams.query);
          }
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
      if (
        (params.data || params.dataURL || params.dataFile) &&
        (params.query || params.queryURL || params.queryFile)
      ) {
        resetState();
        setUpHistory();
        postQuery();
      } else if (!(params.data || params.dataURL || params.queryFile)) {
        setError("No RDF data provided");
      } else if (!(params.query || params.queryURL || params.queryFile)) {
        setError("No query provided");
      }
      window.scrollTo(0, 0);
    }
  }, [params]);

  async function handleSubmit(event) {
    event.preventDefault();
    setParams({ ...paramsFromStateData(data), ...paramsFromStateQuery(query) });
  }

  function postQuery(cb) {
    setLoading(true);
    const formData = params2Form(params);
    setProgressPercent(20);
    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        setProgressPercent(70);
        if (data.error) setError(data.error);
        setResult({ result: data });
        setProgressPercent(80);
        setPermalink(await mkPermalink(API.dataQueryRoute, params));
        if (cb) cb();
        setProgressPercent(100);
      })
      .catch(function(error) {
        setError(
          `Error calling server at ${url}: ${error.message.toString()}.\n Check your input or try again later`
        );
      })
      .finally(() => {
        setLoading(false);
        window.scrollTo(0, 0);
      });
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
        mkPermalinkLong(API.dataQueryRoute, lastParams)
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.dataQueryRoute, params)
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
        <h1>Data Query</h1>
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkDataTabs(data, setData, "RDF input")}
            {mkQueryTabs(query, setQuery, "Query (SPARQL)")}
            <hr />
            <Button
              variant="primary"
              type="submit"
              className={"btn-with-icon " + (loading ? "disabled" : "")}
              disabled={loading}
            >
              Query
            </Button>
          </Form>
        </Col>
        {loading || result || error ? (
          <Col className={"half-col"}>
            <Fragment>
              <Col>
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
                  <ResultEndpointQuery result={result} error={error} />
                ) : null}
                {!params.dataFile &&
                  !params.queryFile &&
                  permalink &&
                  !error && <Permalink url={permalink} />}
              </Col>
            </Fragment>
          </Col>
        ) : (
          <Col className={"half-col"}>
            <Alert variant="info">Query results will appear here</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default DataQuery;
