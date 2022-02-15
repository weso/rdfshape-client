//import SelectFormat from "../components/SelectFormat"
import qs from "query-string";
import React, { useContext, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import shumlex from "shumlex";
import API from "../API";
import PageHeader from "../components/PageHeader";
import { ApplicationContext } from "../context/ApplicationContext";
import { mkPermalinkLong } from "../Permalink";
import ResultXmi2Shex from "../results/ResultXmi2Shex";
import {
  getUmlText,
  InitialUML,
  mkUMLTabs,
  paramsFromStateUML,
  updateStateUml
} from "../uml/UML";
import { mkError } from "../utils/ResponseError";
import { getConverterInput } from "../utils/xmiUtils/shumlexUtils";

export default function Xmi2Shex(props) {
  const [uml, setUml] = useState(InitialUML);

  const [result, setResult] = useState(null);

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [permalink, setPermalink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  // Recover user input data from context, if any. Use first item of the data array
  const { umlData: ctxUml } = useContext(ApplicationContext);

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);

      if (queryParams[API.queryParameters.uml.uml]) {
        const finalUml = updateStateUml(queryParams, uml) || uml;
        setUml(finalUml);

        const newParams = mkParams(finalUml);

        setParams(newParams);
        setLastParams(newParams);
      } else setError(API.texts.errorParsingUrl);
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params && !loading) {
      const umlPresent =
        params[API.queryParameters.uml.uml] &&
        (params[API.queryParameters.uml.source] == API.sources.byFile
          ? params[API.queryParameters.uml.uml].name
          : true);

      if (!umlPresent) setError(API.texts.noProvidedUml);
      else {
        resetState();
        setUpHistory();
        doRequest();
      }
    } else {
      if (ctxUml && typeof ctxUml === "object") setUml(ctxUml);
    }
  }, [params]);

  function mkParams(pUml = uml) {
    return {
      ...paramsFromStateUML(pUml),
      [API.queryParameters.schema.targetEngine]: API.engines.shumlex,
      [API.queryParameters.schema.targetFormat]: API.formats.xmi,
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    setParams(mkParams());
  }

  async function doRequest() {
    setLoading(true);
    setProgressPercent(20);
    try {
      const input = await getConverterInput(params, false);

      const result = shumlex.XMIToShEx(input);
      const graph = shumlex.crearGrafo(result);

      setResult({
        result,
        graph,
      });

      setPermalink(mkPermalinkLong(API.routes.client.xmi2ShexRoute, params));
      checkLinks();
    } catch (error) {
      setError(
        mkError({
          ...error,
          message: `An error has occurred while creating the ShEx equivalent. Check your inputs.\n${error}`,
        })
      );
    } finally {
      setLoading(false);
    }
  }

  // Disabled permalinks, etc. if the user input is too long or a file
  function checkLinks() {
    const disabled =
      getUmlText(uml).length > API.limits.byTextCharacterLimit
        ? API.sources.byText
        : uml.activeSource === API.sources.byFile
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
        mkPermalinkLong(API.routes.client.xmi2ShexRoute, lastParams)
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.routes.client.xmi2ShexRoute, params)
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
          <PageHeader
            title={API.texts.pageHeaders.umlToShex}
            details={API.texts.pageExplanations.umlToShex}
          />
        </Row>
        <Row>
          <Col className="half-col border-right">
            <Form onSubmit={handleSubmit}>
              {mkUMLTabs(uml, setUml)}
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
            <Col className="half-col">
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
                <ResultXmi2Shex
                  result={result}
                  permalink={permalink}
                  disabled={disabledLinks}
                />
              ) : null}
            </Col>
          ) : (
            <Col className="half-col">
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
