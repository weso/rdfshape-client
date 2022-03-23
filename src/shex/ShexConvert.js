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
import {
  allEngines,
  schemaEngines,
  SelectEngine,
  shaclEngines
} from "../components/SelectEngine";
import SelectFormat from "../components/SelectFormat";
import { ApplicationContext } from "../context/ApplicationContext";
import { mkPermalinkLong } from "../Permalink";
import ResultSchemaConvert from "../results/ResultSchemaConvert";
import ResultShapeForm from "../results/ResultShapeForm";
import ResultShex2Xmi from "../results/ResultShex2Xmi";
import axios from "../utils/networking/axiosConfig";
import { mkError } from "../utils/ResponseError";
import { getConverterInput } from "../utils/xmiUtils/shumlexUtils";
import ShExParser from "./shapeform/ShExParser";
import {
  getShexText,
  InitialShex,
  mkShexServerParams,
  mkShexTabs,
  paramsFromStateShex,
  updateStateShex
} from "./Shex";

function ShexConvert(props) {
  const { shexSchema: ctxShex } = useContext(ApplicationContext);

  const [shex, setShex] = useState(ctxShex || InitialShex);

  const [targetSchemaFormat, setTargetSchemaFormat] = useState(
    API.formats.defaultShex
  );

  const [targetSchemaEngine, setTargetSchemaEngine] = useState(
    API.engines.shex
  );

  const [result, setResult] = useState("");

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [permalink, setPermalink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  const urlInfo = API.routes.server.schemaInfo;
  const urlConvert = API.routes.server.schemaConvert;

  // Store the current result type as one of these to know which result component to render
  const resultTypes = Object.freeze({
    schema: "schema",
    shumlex: "shumlex",
    shapeForms: "shapeForms",
    tresd: "3dshex",
  });

  // Extra logic for handling the target format changes
  const handleTargetFormatChange = (newFormat) => {
    // If we are missing the format it is because the engine changed category,
    // set default format for new category
    if (!newFormat) {
      if (targetSchemaEngine === API.engines.shex)
        setTargetSchemaFormat(API.formats.defaultShex);
      else if (shaclEngines.includes(targetSchemaEngine))
        setTargetSchemaFormat(API.formats.defaultShacl);
      else if (targetSchemaEngine === API.engines.shapeForms)
        setTargetSchemaFormat(API.formats.htmlForm);
      else if (targetSchemaEngine === API.engines.shumlex)
        setTargetSchemaFormat(API.formats.xmi);
      else if (targetSchemaEngine === API.engines.tresdshex)
        setTargetSchemaFormat(API.formats.tresd);
    } else setTargetSchemaFormat(newFormat);
  };

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);

      if (queryParams[API.queryParameters.schema.schema]) {
        const finalSchema = updateStateShex(queryParams, shex) || shex;
        setShex(finalSchema);

        const finalTargetFormat =
          queryParams[API.queryParameters.schema.targetFormat] ||
          targetSchemaFormat;
        setTargetSchemaFormat(finalTargetFormat);

        const finalTargetEngine =
          queryParams[API.queryParameters.schema.targetEngine] ||
          targetSchemaEngine;
        setTargetSchemaEngine(finalTargetEngine);

        const params = mkParams(
          finalSchema,
          finalTargetFormat,
          finalTargetEngine
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
        // Execute different logic depending on the target engine
        convertSchema();
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
    pShex = shex,
    pTargetFormat = targetSchemaFormat,
    pTargetEngine = targetSchemaEngine
  ) {
    return {
      ...paramsFromStateShex(pShex),
      [API.queryParameters.schema.targetFormat]: pTargetFormat,
      [API.queryParameters.schema.targetEngine]: pTargetEngine,
    };
  }

  async function mkServerParams(
    pShex = shex,
    pTargetFormat = targetSchemaFormat,
    pTargetEngine = targetSchemaEngine
  ) {
    return {
      [API.queryParameters.schema.schema]: await mkShexServerParams(pShex),
      [API.queryParameters.targetFormat]: pTargetFormat,
      [API.queryParameters.targetEngine]: pTargetEngine,
    };
  }

  // Execute the necessary conversion logic depending on the target engine
  const convertSchema = () => {
    if (schemaEngines.includes(targetSchemaEngine)) serverSchemaConvert();
    else if (targetSchemaEngine === API.engines.shapeForms) clientFormConvert();
    else if (targetSchemaEngine === API.engines.shumlex) clientUmlConvert();
  };

  // Aux function. Before doing any client conversion, ask the server for the Schema info
  // so that we get syntax errors.
  // If no errors: discard response, we can assume ShEx is OK
  // If errors: throw them so that the caller handles them
  async function serverSchemaInfo() {
    try {
      const postParams = await mkServerParams();
      const { data: infoResponse } = await axios.post(urlInfo, postParams);
      return infoResponse;
    } catch (error) {
      throw error;
    }
  }

  // For schema-schema conversions done by server
  async function serverSchemaConvert() {
    setLoading(true);
    setProgressPercent(20);

    try {
      // We don't need to call "serverSchemaInfo", this operation is done in the server
      // and will validate the schema
      const postParams = await mkServerParams();
      const { data: convertResponse } = await axios.post(
        urlConvert,
        postParams
      );
      setProgressPercent(60);

      setResult({ ...convertResponse, renderType: resultTypes.schema });

      setPermalink(mkPermalinkLong(API.routes.client.shexConvertRoute, params));
      checkLinks();
    } catch (error) {
      setError(mkError(error, urlConvert));
    } finally {
      setLoading(false);
    }
  }

  // For schema-uml conversions done with client libraries
  async function clientUmlConvert() {
    setLoading(true);
    setProgressPercent(20);
    try {
      // We do "serverSchemaInfo" first, so that the server validates
      // the user ShEx before processing anything. We don't use this data though.
      const schemaInfo = await serverSchemaInfo();

      // Get the raw data passed to the converter
      const input = await getConverterInput(params);
      const xmiResult = shumlex.shExToXMI(input);

      setResult({ result: xmiResult, renderType: resultTypes.shumlex });

      setPermalink(mkPermalinkLong(API.routes.client.shexConvertRoute, params));
      checkLinks();
    } catch (error) {
      setError(
        mkError({
          ...error,
          message: `An error occurred creating the UML equivalent. Check your inputs.\n${error}`,
        })
      );
    } finally {
      setLoading(false);
    }
  }

  // For schema-form conversions done with client libraries
  async function clientFormConvert() {
    setLoading(true);
    setProgressPercent(20);
    try {
      // We do "serverSchemaInfo" first, so that the server validates
      // the user ShEx before processing anything. We don't use this data though.
      const schemaInfo = await serverSchemaInfo();

      // Get the raw data passed to the converter
      const input = await getConverterInput(params);
      // Parse the ShEx to form
      const result = new ShExParser().parseShExToForm(input);
      // Finish updating state, UI

      setResult({
        form: result,
        message: "successMessage",
        renderType: resultTypes.shapeForms,
      });
      setPermalink(mkPermalinkLong(API.routes.client.shexConvertRoute, params));
      checkLinks();
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
        mkPermalinkLong(API.routes.client.shexConvertRoute, lastParams)
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.routes.client.shexConvertRoute, params)
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
          title={API.texts.pageHeaders.shexConversion}
          details={API.texts.pageExplanations.shexConversion}
        />
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkShexTabs(shex, setShex)}
            <hr />
            {/* Choose target engine */}
            <SelectEngine
              name={API.texts.selectors.targetEngine}
              handleEngineChange={(newEngine) => {
                // Set new engine if present
                newEngine && setTargetSchemaEngine(newEngine);
              }}
              selectedEngine={targetSchemaEngine}
              fromParams={false}
              resetFromParams={false}
              extraOptions={allEngines} // Allow to choose any engines
            />
            {/* Warning to use shape-start if using shapeforms */}
            {targetSchemaEngine === API.engines.shapeForms && (
              <Alert variant="warning">
                A <i>Shape Start</i> is required when using ShapeForms (
                <a href={API.routes.utils.shapeFormHelpUrl} target="_blank">
                  learn more
                </a>
                )
              </Alert>
            )}
            {/* Choose target format, depending on engine */}
            <SelectFormat
              name={API.texts.selectors.targetFormat}
              selectedFormat={targetSchemaFormat}
              handleFormatChange={handleTargetFormatChange}
              urlFormats={
                targetSchemaEngine === API.engines.shex
                  ? API.routes.server.shExFormats
                  : shaclEngines.includes(targetSchemaEngine)
                  ? API.routes.server.shaclFormats
                  : null
              }
              // Additional target options if a client engine (shapeForms or shumlex is used)
              extraOptions={
                targetSchemaEngine === API.engines.shapeForms
                  ? [API.formats.htmlForm]
                  : targetSchemaEngine === API.engines.shumlex
                  ? [API.formats.xmi]
                  : targetSchemaEngine === API.engines.tresdshex
                  ? [API.formats.tresd]
                  : []
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
              // The target engine will decide the result component
              result.renderType === resultTypes.schema ? (
                <ResultSchemaConvert
                  result={result}
                  permalink={permalink}
                  disabled={disabledLinks}
                />
              ) : result.renderType === resultTypes.shumlex ? (
                <ResultShex2Xmi
                  result={result}
                  permalink={permalink}
                  disabled={disabledLinks}
                />
              ) : result.renderType === resultTypes.shapeForms ? (
                <ResultShapeForm
                  result={result}
                  permalink={permalink}
                  disabled={disabledLinks}
                />
              ) : null
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

export default ShexConvert;
