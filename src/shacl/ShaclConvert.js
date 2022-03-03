import qs from "query-string";
import React, { useContext, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import API from "../API";
import PageHeader from "../components/PageHeader";
import { SelectSHACLEngine } from "../components/SelectEngine";
import SelectFormat from "../components/SelectFormat";
import { ApplicationContext } from "../context/ApplicationContext";
import { mkPermalinkLong } from "../Permalink";
import ResultSchemaConvert from "../results/ResultSchemaConvert";
import axios from "../utils/networking/axiosConfig";
import { mkError } from "../utils/ResponseError";
import {
  getShaclText,
  InitialShacl,
  mkShaclServerParams,
  mkShaclTabs,
  paramsFromStateShacl,
  updateStateShacl
} from "./Shacl";

function ShaclConvert(props) {
  const { shaclSchema: ctxShacl } = useContext(ApplicationContext);

  const [shacl, setShacl] = useState(ctxShacl || InitialShacl);

  const [targetSchemaFormat, setTargetSchemaFormat] = useState(
    API.formats.defaultShacl
  );

  const [targetSchemaEngine, setTargetSchemaEngine] = useState(
    API.engines.shaclex
  );

  const [result, setResult] = useState("");

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [permalink, setPermalink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  const urlConvert = API.routes.server.schemaConvert;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);

      if (queryParams[API.queryParameters.schema.schema]) {
        const finalSchema = updateStateShacl(queryParams, shacl) || shacl;
        setShacl(finalSchema);

        const finalTargetFormat =
          queryParams[API.queryParameters.schema.targetFormat] ||
          targetSchemaFormat;
        setTargetSchemaFormat(finalTargetFormat);

        const finalTargetEngine =
          queryParams[API.queryParameters.schema.targetEngine] ||
          targetSchemaEngine;
        setTargetSchemaEngine(finalTargetEngine);

        const newParams = mkParams(
          finalSchema,
          finalTargetFormat,
          finalTargetEngine
        );

        setParams(newParams);
        setLastParams(newParams);
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
          : true) // Extra check for files
      ) {
        resetState();
        setUpHistory();
        postConvert();
      } else {
        setError(API.texts.noProvidedSchema);
      }
    }
  }, [params]);

  function handleSubmit(event) {
    event.preventDefault();
    setParams(mkParams());
  }

  function mkParams(
    pShacl = shacl,
    pTargetFormat = targetSchemaFormat,
    pTargetEngine = targetSchemaEngine
  ) {
    return {
      ...paramsFromStateShacl(pShacl),
      [API.queryParameters.schema.targetFormat]: pTargetFormat,
      [API.queryParameters.schema.targetEngine]: pTargetEngine,
    };
  }

  async function mkServerParams(
    pShacl = shacl,
    pTargetFormat = targetSchemaFormat,
    pTargetEngine = targetSchemaEngine
  ) {
    return {
      [API.queryParameters.schema.schema]: await mkShaclServerParams(pShacl),
      [API.queryParameters.targetFormat]: pTargetFormat,
      [API.queryParameters.targetEngine]: pTargetEngine,
    };
  }

  async function postConvert() {
    setLoading(true);
    setProgressPercent(20);

    try {
      const postParams = await mkServerParams();
      const { data: convertResponse } = await axios.post(
        urlConvert,
        postParams
      );
      setProgressPercent(60);

      setResult(convertResponse);
      setProgressPercent(80);

      setPermalink(
        mkPermalinkLong(API.routes.client.shaclConvertRoute, params)
      );
      checkLinks();
    } catch (error) {
      setError(mkError(error, urlConvert));
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
        mkPermalinkLong(API.routes.client.shaclConvertRoute, lastParams)
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.routes.client.shaclConvertRoute, params)
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
        <PageHeader
          title={API.texts.pageHeaders.shaclConversion}
          details={API.texts.pageExplanations.shaclConversion}
        />
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkShaclTabs(shacl, setShacl)}
            <hr />
            {/* Choose target engine */}
            <SelectSHACLEngine
              name={API.texts.selectors.targetEngine}
              handleEngineChange={(newEngine) => {
                newEngine && setTargetSchemaEngine(newEngine);
              }}
              selectedEngine={targetSchemaEngine}
              fromParams={false}
              resetFromParams={false}
              extraOptions={[API.engines.shex]} // Allow to choose Shex engine too for this case
            />
            {/* Choose target format, depending on engine */}
            <SelectFormat
              name={API.texts.selectors.targetFormat}
              selectedFormat={targetSchemaFormat}
              handleFormatChange={(newFormat) => {
                if (!newFormat) {
                  targetSchemaEngine === API.engines.shex
                    ? setTargetSchemaFormat(API.formats.defaultShex)
                    : setTargetSchemaFormat(API.formats.defaultShacl);
                } else setTargetSchemaFormat(newFormat);
              }}
              urlFormats={
                targetSchemaEngine === API.engines.shex
                  ? API.routes.server.shExFormats
                  : API.routes.server.shaclFormats
              }
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
              <ResultSchemaConvert
                result={result}
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

export default ShaclConvert;
