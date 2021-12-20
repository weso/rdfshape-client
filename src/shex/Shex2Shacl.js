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
import SelectSHACLEngine from "../components/SelectShaclEngine";
import { mkPermalinkLong, params2Form } from "../Permalink";
import ResultShex2Shacl from "../results/ResultShex2Shacl";
import { mkError } from "../utils/ResponseError";
import { format2mode } from "../utils/Utils";
import {
  getShexText,
  InitialShex,
  mkShexTabs,
  paramsFromStateShex,
  updateStateShex
} from "./Shex";

export default function Shex2Shacl(props) {
  const [shex, setShEx] = useState(InitialShex);
  const [targetSchemaFormat, setTargetSchemaFormat] = useState(
    API.formats.defaultShacl
  );
  const [targetSchemaEngine, setTargetSchemaEngine] = useState(
    API.engines.defaultShacl
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
        const finalSchema = updateStateShex(queryParams, shex) || shex;
        setShEx(finalSchema);

        if (queryParams[API.queryParameters.schema.targetFormat]) {
          setTargetSchemaFormat(
            queryParams[API.queryParameters.schema.targetFormat]
          );
        }

        const params = mkParams(
          finalSchema,
          queryParams[API.queryParameters.schema.targetFormat] ||
            targetSchemaFormat
        );

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

  function mkParams(shexParams = shex, targetFormat = targetSchemaFormat) {
    return {
      ...paramsFromStateShex(shexParams),
      [API.queryParameters.schema.targetFormat]: targetFormat,
      [API.queryParameters.schema.targetEngine]: targetSchemaEngine, // Always SHACL
    };
  }

  function postRequest() {
    setLoading(true);
    setProgressPercent(20);
    const formData = params2Form(params);

    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        setProgressPercent(70);
        setResult(data);
        setPermalink(
          mkPermalinkLong(API.routes.client.shex2ShaclRoute, {
            [API.queryParameters.schema.schema]:
              params[API.queryParameters.schema.schema],
            [API.queryParameters.schema.format]:
              params[API.queryParameters.schema.format],
            [API.queryParameters.schema.targetFormat]:
              params[API.queryParameters.schema.targetFormat],
          })
        );
        setProgressPercent(90);
        checkLinks();
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
      getShexText(shex).length > API.limits.byTextCharacterLimit
        ? API.sources.byText
        : shex.activeSource === API.sources.byFile
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
        mkPermalinkLong(API.routes.client.shex2ShaclRoute, {
          [API.queryParameters.schema.schema]:
            lastParams[API.queryParameters.schema.schema],
          [API.queryParameters.schema.format]:
            lastParams[API.queryParameters.schema.format],
          [API.queryParameters.schema.targetFormat]:
            lastParams[API.queryParameters.schema.targetFormat],
        })
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.routes.client.shex2ShaclRoute, {
        [API.queryParameters.schema.schema]:
          params[API.queryParameters.schema.schema],
        [API.queryParameters.schema.format]:
          params[API.queryParameters.schema.format],
        [API.queryParameters.schema.targetFormat]:
          params[API.queryParameters.schema.targetFormat],
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
        <h1>{API.texts.pageHeaders.shexToShacl}</h1>
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkShexTabs(shex, setShEx)}
            <hr />
            <SelectFormat
              name="SHACL format"
              defaultFormat="TURTLE"
              selectedFormat={targetSchemaFormat}
              handleFormatChange={(value) => setTargetSchemaFormat(value)}
              urlFormats={API.routes.server.shaclFormats}
            />
            <SelectSHACLEngine
              handleSHACLEngineChange={(value) => setTargetSchemaEngine(value)}
              selectedSHACLEngine={targetSchemaEngine}
              fromParams={false}
              resetFromParams={false}
            />

            <hr />
            <Button
              variant="primary"
              type="submit"
              className={"btn-with-icon " + (loading ? "disabled" : "")}
              disabled={loading}
            >
              Convert to SHACL
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
              <ResultShex2Shacl
                result={result}
                mode={format2mode(targetSchemaFormat)}
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
