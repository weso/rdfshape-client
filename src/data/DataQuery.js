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
import { mkPermalinkLong, params2Form, Permalink } from "../Permalink";
import {
  getQueryText,
  InitialQuery,
  mkQueryTabs,
  paramsFromStateQuery,
  queryParamsFromQueryParams,
  updateStateQuery
} from "../query/Query";
import ResultEndpointQuery from "../results/ResultEndpointQuery";
import { dataParamsFromQueryParams } from "../utils/Utils";
import {
  getDataText,
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
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      let paramsData,
        paramsQuery = {};
      if (queryParams.data || queryParams.dataURL || queryParams.dataFile) {
        const dataParams = dataParamsFromQueryParams(queryParams);
        const finalData = updateStateData(dataParams, data) || data;
        paramsData = finalData;
        setData(finalData);
      }

      if (queryParams.query || queryParams.queryURL || queryParams.queryFile) {
        const queryDataParams = queryParamsFromQueryParams(queryParams);
        const finalQuery = updateStateQuery(queryDataParams, query) || query;
        paramsQuery = finalQuery;
        setQuery(finalQuery);
      }

      const params = {
        ...paramsFromStateData(paramsData),
        ...paramsFromStateQuery(paramsQuery),
      };

      setParams(params);
      setLastParams(params);
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params) {
      if (
        (params.data ||
          params.dataURL ||
          (params.dataFile && params.dataFile.name)) &&
        (params.query ||
          params.queryURL ||
          (params.queryFile && params.queryFile.name))
      ) {
        resetState();
        setUpHistory();
        postQuery();
      } else if (
        !(
          params.data ||
          params.dataURL ||
          (params.dataFile && params.dataFile.name)
        )
      ) {
        setError("No RDF data provided");
      } else if (
        !(
          params.query ||
          params.queryURL ||
          (params.queryFile && params.queryFile.name)
        )
      ) {
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
        setPermalink(mkPermalinkLong(API.dataQueryRoute, params));
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
                {permalink && !error && (
                  <Permalink
                    url={permalink}
                    disabled={
                      getDataText(data).length + getQueryText(query).length >
                      API.byTextCharacterLimit
                        ? API.byTextTab
                        : data.activeTab === API.byFileTab ||
                          query.activeTab === API.byFileTab
                        ? API.byFileTab
                        : false
                    }
                  />
                )}
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
