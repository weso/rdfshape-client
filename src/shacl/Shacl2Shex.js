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
import SelectFormat from "../components/SelectFormat";
import { mkPermalinkLong, params2Form } from "../Permalink";
import ResultShacl2ShEx from "../results/ResultShacl2Shex";
import { mkError } from "../utils/ResponseError";
import {
  getShaclText,
  InitialShacl,
  mkShaclTabs,
  paramsFromStateShacl,
  updateStateShacl
} from "./Shacl";

export default function Shacl2Shex(props) {
  const [shacl, setShacl] = useState(InitialShacl);
  const [schemaTargetFormat, setSchemaTargetFormat] = useState(
    API.formats.defaultShex
  );

  const [result, setResult] = useState("");

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [permalink, setPermalink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  const url = API.routes.server.schemaConvert;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);

      if (queryParams[API.queryParameters.schema.schema]) {
        const finalSchema = updateStateShacl(queryParams, shacl) || shacl;
        setShacl(finalSchema);

        if (queryParams[API.queryParameters.schema.targetFormat])
          setSchemaTargetFormat(
            queryParams[API.queryParameters.schema.targetFormat]
          );

        const params = {
          ...paramsFromStateShacl(finalSchema),
          [API.queryParameters.schema.targetFormat]:
            queryParams[API.queryParameters.schema.targetFormat] ||
            schemaTargetFormat,
        };

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
          ? params[API.queryParameters.schema.data].name
          : true) // Extra check for files
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

  function targetFormatMode(targetFormat) {
    switch (targetFormat.toUpperCase()) {
      case "TURTLE":
        return "turtle";
      case "RDF/XML":
        return "xml";
      case "TRIG":
        return "xml";
      case "JSON-LD":
        return "javascript";
      default:
        return "turtle";
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    setParams({
      ...paramsFromStateShacl(shacl),
      [API.queryParameters.schema.targetFormat]: schemaTargetFormat,
    });
  }

  function postRequest(cb) {
    setLoading(true);
    setProgressPercent(20);
    const formData = params2Form(params);
    // Target is always ShEx engine
    formData.append(
      API.queryParameters.schema.targetEngine,
      API.engines.defaultShex
    );

    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        setProgressPercent(70);
        setResult(data);
        setPermalink(
          mkPermalinkLong(API.routes.client.shacl2ShExRoute, {
            [API.queryParameters.schema.schema]:
              params[API.queryParameters.schema.schema],
            [API.queryParameters.schema.source]:
              params[API.queryParameters.schema.source],
            [API.queryParameters.schema.format]:
              params[API.queryParameters.schema.format],
            [API.queryParameters.schema.targetFormat]:
              params[API.queryParameters.schema.targetFormat],
            [API.queryParameters.schema.engine]:
              params[API.queryParameters.schema.engine],
            [API.queryParameters.schema.inference]:
              params[API.queryParameters.schema.inference],
          })
        );
        checkLinks();
        setProgressPercent(90);
        if (cb) cb();
        setProgressPercent(100);
      })
      .catch(function(error) {
        setError(mkError(error, url));
      })
      .finally(() => setLoading(false));
  }

  // Disabled permalinks, etc. if the user input is too long or a file
  function checkLinks() {
    const disabled =
      getShaclText(shacl).length > API.limits.byTextCharacterLimit
        ? API.sources.byText
        : shacl.activeSource === API.sources.byFile
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
      // eslint-disable-next-line no-restricted-globals
      history.pushState(
        null,
        document.title,
        mkPermalinkLong(API.routes.client.shacl2ShExRoute, {
          [API.queryParameters.schema.schema]:
            lastParams[API.queryParameters.schema.schema],
          [API.queryParameters.schema.source]:
            lastParams[API.queryParameters.schema.source],
          [API.queryParameters.schema.format]:
            lastParams[API.queryParameters.schema.format],
          [API.queryParameters.schema.targetFormat]:
            lastParams[API.queryParameters.schema.targetFormat],
          [API.queryParameters.schema.engine]:
            lastParams[API.queryParameters.schema.engine],
          [API.queryParameters.schema.inference]:
            lastParams[API.queryParameters.schema.inference],
        })
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.routes.client.shacl2ShExRoute, {
        [API.queryParameters.schema.schema]:
          params[API.queryParameters.schema.schema],
        [API.queryParameters.schema.source]:
          params[API.queryParameters.schema.source],
        [API.queryParameters.schema.format]:
          params[API.queryParameters.schema.format],
        [API.queryParameters.schema.targetFormat]:
          params[API.queryParameters.schema.targetFormat],
        [API.queryParameters.schema.engine]:
          params[API.queryParameters.schema.engine],
        [API.queryParameters.schema.inference]:
          params[API.queryParameters.schema.inference],
      })
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
        <h1>{API.texts.pageHeaders.shaclToShex}</h1>
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkShaclTabs(shacl, setShacl)}
            <hr />
            <SelectFormat
              name="ShEx format"
              defaultFormat={API.formats.defaultShex}
              selectedFormat={schemaTargetFormat}
              handleFormatChange={(value) => setSchemaTargetFormat(value)}
              urlFormats={API.routes.server.shExFormats}
            />

            <hr />
            <Button
              variant="primary"
              type="submit"
              className={"btn-with-icon " + (loading ? "disabled" : "")}
              disabled={loading}
            >
              {API.texts.actionButtons.convert}
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
              <ResultShacl2ShEx
                result={result}
                mode={targetFormatMode(schemaTargetFormat)}
                permalink={permalink}
                disabled={disabledLinks}
              />
            ) : null}
          </Col>
        ) : (
          <Col className={"half-col"}>
            <Alert variant="info">
              {API.texts.conversionResultsWillAppearHere}
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}
