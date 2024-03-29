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
import { useHistory } from "react-router";
import API from "../API";
import PageHeader from "../components/PageHeader";
import { ApplicationContext } from "../context/ApplicationContext";
import { mkPermalinkLong } from "../Permalink";
import {
  getQueryText,
  InitialQuery,
  mkQueryServerParams,
  mkQueryTabs,
  paramsFromStateQuery,
  updateStateQuery
} from "../query/Query";
import ResultSparqlQuery from "../results/ResultSparqlQuery";
import axios from "../utils/networking/axiosConfig";
import { mkError } from "../utils/ResponseError";
import {
  getDataText,
  mkDataServerParams,
  mkDataTabs,
  paramsFromStateData,
  updateStateData
} from "./Data";

function DataQuery(props) {
  // Recover user input data and query from context, if any. Use first item of the data array
  const {
    rdfData: [ctxData],
    sparqlQuery: ctxQuery,
    addRdfData,
  } = useContext(ApplicationContext);

  const history = useHistory();

  const [data, setData] = useState(ctxData || addRdfData());
  const [query, setQuery] = useState(ctxQuery || InitialQuery);

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permalink, setPermalink] = useState("");

  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  const url = API.routes.server.dataQuery;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);

      const finalData = {
        index: 0,
        ...(updateStateData(queryParams, data) || data),
      };
      setData(finalData);

      const finalQuery = updateStateQuery(queryParams, query) || query;
      setQuery(finalQuery);

      const params = mkParams(finalData, finalQuery);

      setParams(params);
      setLastParams(params);
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params) {
      const rdfDataPresent =
        params[API.queryParameters.data.data] &&
        (params[API.queryParameters.data.source] == API.sources.byFile
          ? params[API.queryParameters.data.data].name
          : true);

      const queryPresent =
        params[API.queryParameters.query.query] &&
        (params[API.queryParameters.query.source] == API.sources.byFile
          ? params[API.queryParameters.query.query].name
          : true);

      if (rdfDataPresent && queryPresent) {
        resetState();
        setUpHistory();
        postQuery();
      } else if (!rdfDataPresent) {
        setError(API.texts.noProvidedRdf);
      } else if (!queryPresent) {
        setError(API.texts.noProvidedQuery);
      }
    }
  }, [params]);

  async function handleSubmit(event) {
    event.preventDefault();
    setParams(mkParams());
  }

  function mkParams(pData = data, pQuery = query) {
    return {
      ...paramsFromStateData(pData),
      ...paramsFromStateQuery(pQuery),
    };
  }

  async function mkServerParams(pData = data, pQuery = query) {
    return {
      [API.queryParameters.data.data]: await mkDataServerParams(pData),
      [API.queryParameters.query.query]: await mkQueryServerParams(pQuery),
    };
  }

  async function postQuery() {
    setLoading(true);
    setProgressPercent(20);

    try {
      const { data: serverQueryResponse } = await axios.post(
        url,
        await mkServerParams()
      );
      setProgressPercent(70);
      setResult(serverQueryResponse);
      setPermalink(mkPermalinkLong(API.routes.client.dataQueryRoute, params, true));
      checkLinks();
    } catch (err) {
      setError(mkError(err, url));
    } finally {
      setLoading(false);
    }
  }

  // Disabled permalinks, etc. if the user input is too long or a file
  function checkLinks() {
    const disabled =
      getDataText(data).length + getQueryText(query).length >
      API.limits.byTextCharacterLimit
        ? API.sources.byText
        : data.activeSource === API.sources.byFile ||
          query.activeSource === API.sources.byFile
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
      history.push(
        mkPermalinkLong(API.routes.client.dataQueryRoute, lastParams)
      );
    }
    // Change current url for shareable links
    history.replace(mkPermalinkLong(API.routes.client.dataQueryRoute, params));

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
          title={API.texts.pageHeaders.dataQuery}
          details={API.texts.pageExplanations.dataQuery}
        />
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkDataTabs(data, setData)}
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
                  <ResultSparqlQuery
                    result={result}
                    permalink={permalink}
                    disabled={disabledLinks}
                  />
                ) : null}
              </Col>
            </Fragment>
          </Col>
        ) : (
          <Col className={"half-col"}>
            <Alert variant="info">{API.texts.queryResultsWillAppearHere}</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default DataQuery;
