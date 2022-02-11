import axios from "axios";
import qs from "query-string";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import API from "../API";
import PageHeader from "../components/PageHeader";
import { mkPermalinkLong, params2Form } from "../Permalink";
import {
  getQueryRaw,
  getQueryText,
  InitialQuery,
  mkQueryTabs,
  paramsFromStateQuery,
  updateStateQuery
} from "../query/Query";
import ResultSparqlQuery from "../results/ResultSparqlQuery";
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

  const url = API.routes.server.wikibaseQuery;

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

  async function postQuery() {
    setLoading(true);
    setProgressPercent(20);

    try {
      // Get the query text to be sent as payload
      const queryRaw = await getQueryRaw(query);
      if (!queryRaw) throw "Could not fetch the query data";

      const postData = params2Form({
        [API.queryParameters.wbQuery.endpoint]: endpoint,
        [API.queryParameters.wbQuery.payload]: queryRaw,
      });
      const { data: serverQueryResponse } = await axios.post(url, postData);
      setProgressPercent(70);

      setResult(serverQueryResponse);
      setPermalink(
        mkPermalinkLong(API.routes.client.endpointQueryRoute, params)
      );
    } catch (err) {
      setError(mkError(error, url));
    } finally {
      setLoading(false);
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
      <PageHeader
        title={API.texts.pageHeaders.endpointQuery}
        details={API.texts.pageExplanations.endpointQuery}
      />
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
        <div className="btn-spinner-container">
          <Button
            variant="primary"
            type="submit"
            className={loading ? "disabled" : ""}
            disabled={loading}
          >
            {API.texts.actionButtons.query}
          </Button>
          {loading && (
            <Spinner
              className="loading-spinner"
              animation="border"
              variant="primary"
            />
          )}
        </div>
      </Form>

      {!loading && (
        <div>
          {result || error || permalink ? (
            <Row style={{ margin: "10px auto 10% auto" }}>
              {error ? (
                <Alert className="width-100" variant="danger">
                  {error}
                </Alert>
              ) : result ? (
                <ResultSparqlQuery
                  result={result}
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
      )}
    </Container>
  );
}

export default EndpointQuery;
