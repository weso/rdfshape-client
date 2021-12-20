import axios from "axios";
//import SelectFormat from "../components/SelectFormat"
import qs from "query-string";
import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import shumlex from "shumlex";
import API from "../API";
import { mkPermalinkLong } from "../Permalink";
import ResultShex2Xmi from "../results/ResultShex2Xmi";
import ResultXmi2Shex from "../results/ResultXmi2Shex";
import {
  getUmlText,
  InitialUML,
  mkUMLTabs,
  paramsFromStateUML,
  updateStateUml
} from "../uml/UML";
import { mkError } from "../utils/ResponseError";
import {
  getShexText,
  InitialShex,
  mkShexTabs,
  paramsFromStateShex,
  updateStateShex
} from "./Shex";

export default function Shex2Xmi(props) {
  const successMessage = "Succesful conversion";

  const [shex, setShEx] = useState(InitialShex);
  const [uml, setUml] = useState(InitialUML);

  const [result, setResult] = useState(null);

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [permalink, setPermalink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  const [isShEx2Uml, setIsShEx2Uml] = useState(true);

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      let shex2Uml = isShEx2Uml;

      let stateShex,
        stateUml = {};

      // Deduce conversion direction from URL
      if (queryParams[API.queryParameters.schema.targetEngine]) {
        shex2Uml =
          queryParams[API.queryParameters.schema.targetEngine] ===
          API.engines.xml;
        setIsShEx2Uml(shex2Uml);
      }

      if (
        queryParams[API.queryParameters.schema.schema] ||
        queryParams[API.queryParameters.uml.uml]
      ) {
        // If ShEx to UML, get ShEx from query params, else get UML from query params
        if (shex2Uml && queryParams[API.queryParameters.schema.schema]) {
          stateShex = updateStateShex(queryParams, shex) || shex;
          setShEx(stateShex);
        } else if (queryParams[API.queryParameters.uml.uml]) {
          stateUml = updateStateUml(queryParams, uml) || uml;
          setUml(stateUml);
        }

        const params = mkParams(stateShex, stateUml, shex2Uml);
        setParams(params);
        setLastParams(params);
      } else {
        setError(API.texts.errorParsingUrl);
      }
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params && !loading) {
      const schemaPresent =
        params[API.queryParameters.schema.schema] &&
        (params[API.queryParameters.schema.source] == API.sources.byFile
          ? params[API.queryParameters.schema.schema].name
          : true);

      const umlPresent =
        params[API.queryParameters.uml.uml] &&
        (params[API.queryParameters.uml.source] == API.sources.byFile
          ? params[API.queryParameters.uml.uml].name
          : true);

      if (isShEx2Uml && !schemaPresent) setError(API.texts.noProvidedSchema);
      else if (!isShEx2Uml && !umlPresent) setError(API.texts.noProvidedUml);
      else {
        resetState();
        setUpHistory();
        doRequest();
      }

      window.scrollTo(0, 0);
    }
  }, [params]);

  function mkParams(stateShex = shex, stateUml = uml, shex2Uml = isShEx2Uml) {
    const baseParams = shex2Uml
      ? paramsFromStateShex(stateShex)
      : paramsFromStateUML(stateUml);

    return {
      ...baseParams,
      [API.queryParameters.schema.engine]: shex2Uml
        ? API.engines.shex
        : API.engines.xml,
      [API.queryParameters.schema.targetEngine]: shex2Uml
        ? API.engines.xml
        : API.engines.shex,
      [API.queryParameters.schema.targetFormat]: shex2Uml
        ? API.formats.xml
        : API.formats.shexc,
    };
  }

  function mkPermalinkParams(source = params) {
    const baseParams = {
      [API.queryParameters.schema.targetEngine]:
        source[API.queryParameters.schema.targetEngine],
    };
    return isShEx2Uml
      ? {
          [API.queryParameters.schema.schema]:
            source[API.queryParameters.schema.schema],
          [API.queryParameters.schema.format]:
            source[API.queryParameters.schema.format],
          [API.queryParameters.schema.source]:
            source[API.queryParameters.schema.source],
          ...baseParams,
        }
      : {
          [API.queryParameters.uml.uml]: source[API.queryParameters.uml.uml],
          [API.queryParameters.uml.source]:
            source[API.queryParameters.uml.source],
          ...baseParams,
        };
  }

  function handleSubmit(event) {
    event.preventDefault();
    setParams(mkParams());
  }

  // This validation is done in the client, so the client must parse the input,
  // whether if it's plain text, a URL to be fetched or a file to be parsed.
  async function getConverterInput() {
    const userData = isShEx2Uml
      ? params[API.queryParameters.schema.schema]
      : params[API.queryParameters.uml.uml];

    const userDataSource = isShEx2Uml
      ? params[API.queryParameters.schema.source]
      : params[API.queryParameters.uml.source];

    switch (userDataSource) {
      // Plain text, do nothing
      case API.sources.byText:
        return userData;

      // URL, ask the RDFShape server to fetch the contents for us (prevent CORS)
      case API.sources.byUrl:
        return axios
          .get(API.routes.server.fetchUrl, {
            params: { url: userData },
          })
          .then((res) => res.data)
          .catch((err) => {
            throw err;
          });

      // File upload, read the file and return the raw text
      case API.sources.byFile:
        return await new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result);
          reader.readAsText(userData);
        });
    }
  }

  async function doRequest() {
    setLoading(true);
    setProgressPercent(20);
    let result = "";
    let graph = "";
    try {
      const input = await getConverterInput();

      if (isShEx2Uml) {
        result = shumlex.shExToXMI(input);
      } else {
        result = shumlex.XMIToShEx(input);
        graph = shumlex.crearGrafo(result);
      }
      checkLinks();
      setProgressPercent(90);
      setResult({
        result,
        grafico: graph,
        msg: successMessage,
      });
      setPermalink(
        mkPermalinkLong(API.routes.client.shex2XmiRoute, mkPermalinkParams())
      );
      setProgressPercent(100);
    } catch (error) {
      setError(
        mkError({
          ...error,
          message: `An error has occurred while creating the ${
            isShEx2Uml ? "UML" : "ShEx"
          } equivalent:\n${error}`,
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
        mkPermalinkLong(
          API.routes.client.shex2XmiRoute,
          mkPermalinkParams(lastParams)
        )
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.routes.client.shex2XmiRoute, mkPermalinkParams())
    );

    setLastParams(params);
  }

  function resetState() {
    setResult(null);
    setPermalink(null);
    setError(null);
    setProgressPercent(0);
  }

  function loadOppositeConversion() {
    resetState();
    setIsShEx2Uml(!isShEx2Uml);
  }

  return (
    <Container fluid={true}>
      {isShEx2Uml && (
        <>
          <Row>
            <h1>{API.texts.pageHeaders.shexToUml}</h1>
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
                  Convert to UML
                </Button>
              </Form>
              <Button
                id="uml2shex"
                variant="secondary"
                onClick={loadOppositeConversion}
                className={"btn-with-icon " + (loading ? "disabled" : "")}
                disabled={loading}
              >
                Load UML to ShEx converter
              </Button>
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
                  <ResultShex2Xmi
                    result={result}
                    mode={API.formats.xml}
                    permalink={permalink}
                    disabled={disabledLinks}
                  />
                ) : (
                  ""
                )}
              </Col>
            ) : (
              <Col className={"half-col"}>
                <Alert variant="info">
                  {API.texts.conversionResultsWillAppearHere}
                </Alert>
              </Col>
            )}
          </Row>
        </>
      )}
      {!isShEx2Uml && (
        <>
          <Row>
            <h1>{API.texts.pageHeaders.umlToShex}</h1>
          </Row>
          <Row>
            <Col className={"half-col border-right"}>
              <Form onSubmit={handleSubmit}>
                {mkUMLTabs(uml, setUml)}
                <hr />
                <Button
                  variant="primary"
                  type="submit"
                  className={"btn-with-icon " + (loading ? "disabled" : "")}
                  disabled={loading}
                >
                  Convert to ShEx
                </Button>
              </Form>
              <Button
                id="shex2uml"
                variant="secondary"
                onClick={loadOppositeConversion}
                className={"btn-with-icon " + (loading ? "disabled" : "")}
                disabled={loading}
              >
                Load ShEx to UML converter
              </Button>
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
                  <ResultXmi2Shex
                    result={result}
                    mode={API.formats.turtle}
                    permalink={permalink}
                    activeSource="XMI"
                    disabled={
                      getUmlText(uml).length > API.limits.byTextCharacterLimit
                        ? API.sources.byText
                        : uml.activeSource === API.sources.byFile
                        ? API.sources.byFile
                        : false
                    }
                  />
                ) : (
                  ""
                )}
              </Col>
            ) : (
              <Col className={"half-col"}>
                <Alert variant="info">
                  {API.texts.conversionResultsWillAppearHere}
                </Alert>
              </Col>
            )}
          </Row>
        </>
      )}
    </Container>
  );
}
