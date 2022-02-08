import axios from "axios";
import qs from "query-string";
import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import API from "../API";
import { mkPermalinkLong, params2Form } from "../Permalink";
import ResultSchemaInfo from "../results/ResultSchemaInfo";
import { mkError } from "../utils/ResponseError";
import {
  getShaclText,
  InitialShacl,
  mkShaclTabs,
  paramsFromStateShacl,
  updateStateShacl
} from "./Shacl";

function ShaclInfo(props) {
  const [shacl, setShacl] = useState(InitialShacl);

  const [result, setResult] = useState("");

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [permalink, setPermalink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  const urlInfo = API.routes.server.schemaInfo;
  const urlVisual = API.routes.server.schemaConvert;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);

      if (queryParams[API.queryParameters.schema.schema]) {
        const finalSchema = updateStateShacl(queryParams, shacl) || shacl;
        setShacl(finalSchema);

        const params = mkParams(finalSchema);

        setParams(params);
        setLastParams(params);
      } else {
        setError(API.texts.errorParsingUrl);
      }
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params && !loading) {
      if (
        params[API.queryParameters.schema.schema] &&
        (params[API.queryParameters.schema.source] == API.sources.byFile
          ? params[API.queryParameters.schema.schema].name
          : true)
      ) {
        resetState();
        setUpHistory();
        postRequest();
      } else {
        setError(API.texts.noProvidedSchema);
      }
      window.scrollTo(0, 0);
    }
  }, [params]);

  function handleSubmit(event) {
    event.preventDefault();
    setParams(mkParams());
  }

  function mkParams(shaclParams = shacl) {
    return {
      ...paramsFromStateShacl(shaclParams),
    };
  }

  async function postRequest() {
    setLoading(true);
    setProgressPercent(20);

    try {
      // Firstly: get the schema basic info and prefix map
      const infoForm = params2Form(params);
      const { data: resultSchemaInfo } = await axios.post(urlInfo, infoForm);
      setProgressPercent(50);

      // Secondly: get schema visualization
      const visualizeForm = params2Form({
        ...params,
        [API.queryParameters.schema.targetFormat]: API.formats.svg,
      });
      const { data: resultSchemaVisualize } = await axios.post(
        urlVisual,
        visualizeForm
      );
      setProgressPercent(80);

      // Set result with all data
      setResult({
        resultInfo: resultSchemaInfo,
        resultVisualize: resultSchemaVisualize,
      });

      // Set permalinks and finish
      setPermalink(mkPermalinkLong(API.routes.client.shexInfoRoute, params));
      checkLinks();
    } catch (error) {
      setError(mkError(error, urlInfo));
    } finally {
      setLoading(false);
    }
  }

  // Disabled permalinks, etc. if the user input is too long or a file
  function checkLinks() {
    const disabled =
      getShaclText(shacl).length > API.limits.byTextCharacterLimit
        ? API.sources.byText
        : shacl.activeSource === API.sources.byFile
        ? API.sources.byText
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
        mkPermalinkLong(API.routes.client.shaclInfoRoute, lastParams)
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.routes.client.shaclInfoRoute, params)
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
        <h1>{API.texts.pageHeaders.shaclInfo}</h1>
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkShaclTabs(shacl, setShacl)}
            <hr />
            <Button
              variant="primary"
              type="submit"
              className={"btn-with-icon " + (loading ? "disabled" : "")}
              disabled={loading}
            >
              {API.texts.actionButtons.analyze}
            </Button>
          </Form>
        </Col>
        {loading || result || error || permalink ? (
          <Col className={"half-col"}>
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
              <ResultSchemaInfo
                result={result}
                permalink={permalink}
                disabled={disabledLinks}
              />
            ) : null}
          </Col>
        ) : (
          <Col className={"half-col"}>
            <Alert variant="info">{API.texts.schemaInfoWillAppearHere}</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default ShaclInfo;
