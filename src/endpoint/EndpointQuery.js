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
import { mkPermalinkLong, params2Form } from "../Permalink";
import {
  getQueryText,
  InitialQuery,
  mkQueryTabs,
  paramsFromStateQuery,
  updateStateQuery
} from "../query/Query";
import ResultEndpointQuery from "../results/ResultEndpointQuery";
import { mkError } from "../utils/ResponseError";
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

  const url = API.routes.server.endpointQuery;
  const resultsElementId = "results";

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      let paramsQuery,
        paramsEndpoint = {};

      // Query State
      if (queryParams[API.queryParameters.query.query]) {
        paramsQuery = updateStateQuery(queryParams, query) || query;
        setQuery(paramsQuery);
      }

      // Endpoint State
      if (queryParams[API.queryParameters.endpoint.endpoint]) {
        paramsEndpoint = {
          [API.queryParameters.endpoint.endpoint]:
            queryParams[API.queryParameters.endpoint.endpoint],
        };
        setEndpoint(queryParams[API.queryParameters.endpoint.endpoint]);
      }

      // Params to be used in first query
      let params = {
        ...paramsFromStateQuery(paramsQuery),
        ...paramsEndpoint,
      };

      setParams(params);
      setLastParams(params);
    }
  }, [props.location?.search]);

  // Perform query on params change (normally on submit)
  useEffect(() => {
    if (params && !loading) {
      if (!params[API.queryParameters.endpoint.endpoint])
        setError(API.texts.noProvidedEndpoint);
      else if (
        params[API.queryParameters.query.query] &&
        (params[API.queryParameters.query.source] == API.sources.byFile
          ? params[API.queryParameters.query.query].name
          : true) // Extra check for files
      ) {
        resetState();
        setUpHistory();
        postQuery();
      } else setError(API.texts.noProvidedQuery);
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
    setParams({
      ...paramsFromStateQuery(query),
      [API.queryParameters.endpoint.endpoint]: endpoint,
    });
  }

  function postQuery(cb) {
    setLoading(true);
    setProgressPercent(20);
    const formData = params2Form(params);

    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        setProgressPercent(70);
        setResult({ result: data });
        setPermalink(
          mkPermalinkLong(API.routes.client.endpointQueryRoute, params)
        );
        setProgressPercent(90);
        if (cb) cb();
        setProgressPercent(100);
      })
      .catch(function(error) {
        setError(mkError(error, url));
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
        mkPermalinkLong(API.routes.client.endpointQueryRoute, lastParams)
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.routes.client.endpointQueryRoute, params)
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
      <h1>{API.texts.pageHeaders.endpointQuery}</h1>
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
        {mkQueryTabs(query, setQuery)}
        <hr />
        <Button
          variant="primary"
          type="submit"
          className={"btn-with-icon " + (loading ? "disabled" : "")}
          disabled={loading}
        >
          {API.texts.actionButtons.query}
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
                  API.limits.byTextCharacterLimit
                    ? API.sources.byText
                    : query.activeSource === API.sources.byFile
                    ? API.sources.byFile
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
