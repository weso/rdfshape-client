import axios from "axios";
import qs from "query-string";
import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import API from "../API";
import { mkPermalink, mkPermalinkLong, params2Form } from "../Permalink";
import {
  getQueryText,
  InitialQuery,
  mkQueryTabs,
  paramsFromStateQuery,
  queryParamsFromQueryParams,
  updateStateQuery
} from "../query/Query";
import ResultEndpointQuery from "../results/ResultEndpointQuery";
import { endpointParamsFromQueryParams } from "./Endpoint";
import EndpointInput from "./EndpointInput";

function EndpointQuery(props) {
  const [endpoint, setEndpoint] = useState("");
  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState(InitialQuery);
  const [permalink, setPermalink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [controlPressed, setControlPressed] = useState(false);

  const url = API.endpointQuery;
  const resultsElementId = "results";

  useEffect(() => {
    if (props.location.search) {
      const queryParams = qs.parse(props.location.search);
      let paramsQuery,
        paramsEndpoint = {};

      // Query State
      if (queryParams.query || queryParams.queryURL || queryParams.queryFile) {
        paramsQuery = queryParamsFromQueryParams(queryParams);
        setQuery(updateStateQuery(paramsQuery, query) || query);
      }

      // Endpoint State
      if (queryParams.endpoint) {
        paramsEndpoint = endpointParamsFromQueryParams(queryParams);
        setEndpoint(paramsEndpoint.endpoint);
      }

      // Params to be used in first query
      let params = {
        ...paramsFromStateQuery(updateStateQuery(paramsQuery, query) || query),
        endpoint: paramsEndpoint.endpoint || endpoint,
      };

      setParams(params);
      setLastParams(params);
    }
  }, [props.location.search]);

  // Perform query on params change (normally on submit)
  useEffect(() => {
    if (params && !loading) {
      if (!params.endpoint) setError("No endpoint provided");
      else if (!(params.query || params.queryURL || (params.queryFile && params.queryFile.name)))
        setError("No query provided");
      else {
        resetState();
        setUpHistory();
        postQuery();
      }
    }
  }, [params]);

  // Scroll after query
  useEffect(() => {
    setTimeout(showResults, 500);
  }, [result]);

  function handleOnChange(value) {
    setEndpoint(value);
  }

  function handleOnSelect() {
    setLoading(false);
  }

  // Used to query the server on "Control + Enter"
  function onKeyDown(event) {
    const key = event.which || event.keyCode;
    if (key === 17) setControlPressed(true);
    else if (key === 13 && controlPressed) handleSubmit(event);
  }

  function onKeyUp(event) {
    const key = event.which || event.keyCode;
    if (key === 17) setControlPressed(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setParams({ ...paramsFromStateQuery(query), endpoint });
  }

  function postQuery(cb) {
    setLoading(true);
    setProgressPercent(20);
    const formData = params2Form(params);

    axios
      .post(url, formData, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => response.data)
      .then(async (data) => {
        setProgressPercent(70);
        setResult({ result: data });
        setPermalink(await mkPermalink(API.endpointQueryRoute, params));
        setProgressPercent(90);
        if (cb) cb();
        setProgressPercent(100);
      })
      .catch(function(error) {
        setError(
          `Error calling server at ${url}: ${error}.\n Did you input a valid SPARQL endpoint and query?`
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function showResults() {
    const resultsDiv = document.getElementById(resultsElementId);
    if (resultsDiv) {
      window.scrollTo(0, resultsDiv.offsetTop - resultsDiv.scrollTop);
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
        mkPermalinkLong(API.endpointQueryRoute, lastParams)
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.endpointQueryRoute, params)
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
      <h1>Endpoint query</h1>
      <Form
        id="common-endpoints"
        onSubmit={handleSubmit}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      >
        <EndpointInput
          value={endpoint}
          handleOnChange={handleOnChange}
          handleOnSelect={handleOnSelect}
        />
        {mkQueryTabs(query, setQuery, "Query (SPARQL)")}
        <hr />
        <Button
          variant="primary"
          type="submit"
          className={"btn-with-icon " + (loading ? "disabled" : "")}
          disabled={loading}
        >
          Query endpoint (Ctrl+Enter)
        </Button>
      </Form>

      <div id={resultsElementId}>
        {loading || result || error || permalink ? (
          <Row style={{ margin: "10px auto 10% auto" }}>
            {loading ? (
              <ProgressBar
                className="width-100"
                striped
                animated
                variant="info"
                now={progressPercent}
              />
            ) : error ? (
              <Alert className="width-100" variant="danger">
                {error}
              </Alert>
            ) : result ? (
              <ResultEndpointQuery
                result={result}
                error={error}
                permalink={permalink}
                disabled={
                  getQueryText(query).length + endpoint.length >
                    API.byTextCharacterLimit
                    ? API.byTextTab
                    : query.activeTab === API.byFileTab
                    ? API.byFileTab
                    : false
                }
              />
            ) : null}
          </Row>
        ) : null}
      </div>
    </Container>
  );
}

export default EndpointQuery;
