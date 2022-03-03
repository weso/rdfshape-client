import qs from "query-string";
import React, { useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import API from "../API";
import PageHeader from "../components/PageHeader";
import { ApplicationContext } from "../context/ApplicationContext";
import { mkPermalinkLong } from "../Permalink";
import {
  getQueryText,
  InitialQuery, mkQueryTabs,
  paramsFromStateQuery,
  updateStateQuery
} from "../query/Query";
import ResultSparqlQuery from "../results/ResultSparqlQuery";
import axios from "../utils/networking/axiosConfig";
import { mkError } from "../utils/ResponseError";
import { getItemRaw } from "../utils/Utils";
import EndpointInput from "./EndpointInput";

function EndpointQuery(props) {
  // Recover user endpoint and query from context, if any
  const { sparqlEndpoint: ctxEndpoint, sparqlQuery: ctxQuery } = useContext(
    ApplicationContext
  );

  const [endpoint, setEndpoint] = useState(ctxEndpoint || "");
  const [query, setQuery] = useState(ctxQuery || InitialQuery);

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const [permalink, setPermalink] = useState(null);
  const [loading, setLoading] = useState(false);

  const [progressPercent, setProgressPercent] = useState(0);
  const [controlPressed, setControlPressed] = useState(false);

  const url = API.routes.server.wikibaseQuery;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);

      const finalQuery = updateStateQuery(queryParams, query) || query;
      setQuery(finalQuery);

      const finalEndpoint =
        queryParams[API.queryParameters.wbQuery.endpoint] || endpoint;
      setEndpoint(finalEndpoint);

      // Params to be used in first query
      const newParams = mkParams(finalEndpoint, finalQuery);

      setParams(newParams);
      setLastParams(newParams);
    }
  }, [props.location?.search]);

  // Perform query on params change (normally on submit)
  useEffect(() => {
    if (params && !loading) {
      if (!params[API.queryParameters.wbQuery.endpoint])
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
    setParams(mkParams());
  }

  function mkParams(pEndpoint = endpoint, pQuery = query) {
    return {
      [API.queryParameters.wbQuery.endpoint]: pEndpoint,
      ...paramsFromStateQuery(pQuery),
    };
  }

  async function mkServerParams(pEndpoint = endpoint, pQuery = query) {
    return {
      [API.queryParameters.wbQuery.endpoint]: pEndpoint,
      [API.queryParameters.wbQuery.payload]: await getItemRaw(pQuery),
    };
  }

  async function postQuery() {
    setLoading(true);
    setProgressPercent(20);

    try {
      // Get the query text to be sent as payload
      const postData = await mkServerParams();
      if (!postData) throw API.texts.errorFetchingQuery;

      const { data: serverQueryResponse } = await axios.post(url, postData);
      setProgressPercent(70);

      setResult(serverQueryResponse);
      setPermalink(
        mkPermalinkLong(API.routes.client.endpointQueryRoute, params)
      );
    } catch (err) {
      setError(mkError(err, url));
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
          endpoint={endpoint}
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
