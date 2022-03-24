import qs from "query-string";
import React, { useContext, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import { useHistory } from "react-router";
import API from "../API";
import PageHeader from "../components/PageHeader";
import { ApplicationContext } from "../context/ApplicationContext";
import { mkPermalinkLong } from "../Permalink";
import ResultEndpointInfo from "../results/ResultEndpointInfo";
import axios from "../utils/networking/axiosConfig";
import { mkError } from "../utils/ResponseError";
import EndpointInput from "./EndpointInput";

function EndpointInfo(props) {
  const { sparqlEndpoint: ctxEndpoint } = useContext(ApplicationContext);

  const history = useHistory();

  const [endpoint, setEndpoint] = useState(ctxEndpoint || "");
  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [permalink, setPermalink] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const url = API.routes.server.endpointInfo;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      if (queryParams[API.queryParameters.wbQuery.endpoint]) {
        const finalEndpoint =
          queryParams[API.queryParameters.wbQuery.endpoint] || endpoint;
        setEndpoint(finalEndpoint);

        const newParams = mkParams(finalEndpoint);
        setParams(newParams);
        setLastParams(newParams);
      } else {
        setError(API.texts.errorParsingUrl);
      }
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params && !loading) {
      if (params[API.queryParameters.wbQuery.endpoint]) {
        resetState();
        setUpHistory();
        postEndpointInfo();
      } else {
        setError(API.texts.noProvidedEndpoint);
      }
    }
  }, [params]);

  function handleOnChange(value) {
    setEndpoint(value);
  }

  function handleOnSelect() {
    setLoading(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setParams(mkParams());
  }

  function mkParams(pEndpoint = endpoint) {
    return {
      [API.queryParameters.wbQuery.endpoint]: pEndpoint.trim(),
    };
  }

  function mkServerParams(pEndpoint = endpoint) {
    return {
      [API.queryParameters.wbQuery.endpoint]: pEndpoint.trim(),
    };
  }

  async function postEndpointInfo() {
    setLoading(true);
    setProgressPercent(20);

    try {
      const { data } = await axios.get(url, { params: mkServerParams() });
      setProgressPercent(70);
      setResult(data);
      setPermalink(
        mkPermalinkLong(API.routes.client.endpointInfoRoute, params, true)
      );
    } catch (error) {
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
      history.push(
        mkPermalinkLong(API.routes.client.endpointInfoRoute, lastParams)
      );
    }
    // Change current url for shareable links
    history.replace(
      mkPermalinkLong(API.routes.client.endpointInfoRoute, params)
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
        title={API.texts.pageHeaders.endpointInfo}
        details={API.texts.pageExplanations.endpointInfo}
      />
      <Form id="common-endpoints" onSubmit={handleSubmit}>
        <EndpointInput
          endpoint={endpoint}
          handleOnChange={handleOnChange}
          handleOnSelect={handleOnSelect}
        />
        <hr />
        <Button
          variant="primary"
          type="submit"
          className={"btn-with-icon " + (loading ? "disabled" : "")}
          disabled={loading}
        >
          {API.texts.actionButtons.fetch}
        </Button>
      </Form>

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
            <ResultEndpointInfo
              result={result}
              error={error}
              permalink={permalink}
              disabled={
                endpoint && endpoint.length > API.limits.byTextCharacterLimit
                  ? API.sources.byText
                  : false
              }
            />
          ) : null}
        </Row>
      ) : null}
    </Container>
  );
}

export default EndpointInfo;
