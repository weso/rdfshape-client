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
import { mkPermalinkLong } from "../Permalink";
import ResultShapeForm from "../results/ResultShapeForm";
import { mkError } from "../utils/ResponseError";
import { getFileContents } from "../utils/Utils";
import ShexParser from "./shapeform/ShExParser";
import {
  getShexText,
  InitialShex,
  mkShexTabs,
  paramsFromStateShex,
  updateStateShex
} from "./Shex";

export default function ShEx2XMI(props) {
  const successMessage = "Form generated successfully";
  const [shex, setShEx] = useState(InitialShex);

  // Results passed down to the results component, containing:
  // form: contains the HTML form generate by shapeForm
  // msg: message broadly describing the result
  const [result, setResult] = useState(null);

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [permalink, setPermalink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  const shapeFormHelpUrl =
    "https://github.com/weso/shapeForms#requirementslimitations";

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);

      if (queryParams[API.queryParameters.schema.schema]) {
        const finalSchema = updateStateShex(queryParams, shex) || shex;
        setShEx(finalSchema);

        const params = mkParams(finalSchema);

        setParams(params);
        setLastParams(params);
      } else {
        setError(API.texts.noProvidedRdf);
      }
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params && !loading) {
      if (
        params[API.queryParameters.schema.schema] &&
        (params[API.queryParameters.schema.source] == API.sources.byFile
          ? params[API.queryParameters.schema.schema].name
          : true) // Extra check for files
      ) {
        resetState();
        setUpHistory();
        doRequest();
      } else {
        setError(API.texts.noProvidedSchema);
      }
      window.scrollTo(0, 0);
    }
  }, [params]);

  // This validation is done in the client, so the client must parse the input,
  // whether it's plain text, a URL to be fetched or a file to be parsed.
  async function getConverterInput() {
    const schemaData = params[API.queryParameters.schema.schema];

    switch (params[API.queryParameters.schema.source]) {
      // Plain text, do nothing
      case API.sources.byText:
        return schemaData;

      // URL, ask the RDFShape server to fetch the contents for us (prevent CORS)
      case API.sources.byUrl:
        return axios
          .get(API.routes.server.fetchUrl, {
            params: { url: schemaData },
          })
          .then((res) => res.data)
          .catch((err) => {
            throw err;
          });

      // File upload, read the file and return the raw text
      case API.sources.byFile:
        return getFileContents(schemaData);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    setParams(mkParams());
  }

  function mkParams(shexParams = shex) {
    return {
      ...paramsFromStateShex(shexParams),
      [API.queryParameters.schema.engine]: API.engines.shex, // Always converting from ShEx
      [API.queryParameters.schema.targetEngine]: API.engines.xml, // Always converting to ShEx
    };
  }

  async function doRequest() {
    setLoading(true);
    setProgressPercent(20);
    try {
      // Get the raw data passed to the converter
      const input = await getConverterInput();
      // Parse the ShEx to form
      const result = new ShexParser().parseShExToForm(input);
      // Finish updating state, UI
      setProgressPercent(90);
      checkLinks();
      setResult({
        form: result,
        message: successMessage,
      });
      setPermalink(
        mkPermalinkLong(API.routes.client.shapeFormRoute, {
          [API.queryParameters.schema.schema]:
            params[API.queryParameters.schema.schema],
          [API.queryParameters.schema.format]:
            params[API.queryParameters.schema.format],
          [API.queryParameters.schema.source]:
            params[API.queryParameters.schema.source],
        })
      );
      setProgressPercent(100);
    } catch (error) {
      setError(
        mkError({
          ...error,
          message: `An error has occurred while creating the Form equivalent:\n${error}`,
        })
      );
    } finally {
      setLoading(false);
    }
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
        mkPermalinkLong(API.routes.client.shapeFormRoute, {
          [API.queryParameters.schema.schema]:
            lastParams[API.queryParameters.schema.schema],
          [API.queryParameters.schema.format]:
            lastParams[API.queryParameters.schema.format],
          [API.queryParameters.schema.source]:
            lastParams[API.queryParameters.schema.source],
        })
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.routes.client.shapeFormRoute, {
        [API.queryParameters.schema.schema]:
          params[API.queryParameters.schema.schema],
        [API.queryParameters.schema.format]:
          params[API.queryParameters.schema.format],
        [API.queryParameters.schema.source]:
          params[API.queryParameters.schema.source],
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
      <>
        <Row>
          <h1>{API.texts.pageHeaders.shexToForm}</h1>
        </Row>
        <Row>
          <Col className={"half-col border-right"}>
            <Form onSubmit={handleSubmit}>
              {mkShexTabs(shex, setShEx)}
              <hr />
              <Button
                variant="primary"
                type="submit"
                className={"btn-with-icon " + (loading ? "disabled" : "")}
                disabled={loading}
              >
                {API.texts.actionButtons.createForm}
              </Button>
            </Form>
          </Col>
          {loading || result || error || permalink ? (
            <Col className={"half-col"} style={{ marginTop: "1.95em" }}>
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
                <ResultShapeForm
                  result={result}
                  permalink={permalink}
                  disabled={disabledLinks}
                />
              ) : (
                ""
              )}
            </Col>
          ) : (
            <Col className={"half-col"}>
              <Alert variant="warning">
                {API.texts.shapeStartRequired} (
                <a href={shapeFormHelpUrl} target="_blank">
                  learn more
                </a>
                )
              </Alert>
              <Alert variant="info">
                {API.texts.conversionResultsWillAppearHere}
              </Alert>
            </Col>
          )}
        </Row>
      </>
    </Container>
  );
}
