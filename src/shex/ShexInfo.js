import qs from "query-string";
import React, { useContext, useEffect, useState } from "react";
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
import ResultSchemaInfo from "../results/ResultSchemaInfo";
import axios from "../utils/networking/axiosConfig";
import { mkError } from "../utils/ResponseError";
import {
  getShexText,
  InitialShex,
  mkShexServerParams,
  mkShexTabs,
  paramsFromStateShex,
  updateStateShex
} from "./Shex";

function ShexInfo(props) {
  const { shexSchema: ctxShex } = useContext(ApplicationContext);
  const history = useHistory();

  const [shex, setShEx] = useState(ctxShex || InitialShex);

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
        const finalSchema = updateStateShex(queryParams, shex) || shex;
        setShEx(finalSchema);

        const newParams = mkParams(finalSchema);

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
          : true)
      ) {
        resetState();
        setUpHistory();
        postRequest();
      } else {
        setError(API.texts.noProvidedSchema);
      }
    }
  }, [params]);

  function handleSubmit(event) {
    event.preventDefault();
    setParams(mkParams());
  }

  function mkParams(pShex = shex) {
    return {
      ...paramsFromStateShex(pShex),
    };
  }

  async function mkServerParams(pShex = shex) {
    return {
      [API.queryParameters.schema.schema]: await mkShexServerParams(pShex),
    };
  }

  async function postRequest() {
    setLoading(true);
    setProgressPercent(20);

    try {
      const baseParams = await mkServerParams();
      setProgressPercent(40);
      // Firstly: get the schema basic info and prefix map
      const { data: resultSchemaInfo } = await axios.post(urlInfo, baseParams);
      setProgressPercent(50);

      // Secondly: get schema visualization
      const visualizeParams = {
        ...baseParams,
        [API.queryParameters.targetFormat]: API.formats.svg,
      };
      const { data: resultSchemaVisualize } = await axios.post(
        urlVisual,
        visualizeParams
      );
      setProgressPercent(80);

      // Set result with all data
      setResult({
        resultInfo: resultSchemaInfo,
        resultVisualize: resultSchemaVisualize,
      });

      // Set permalinks and finish
      setPermalink(
        mkPermalinkLong(API.routes.client.shexInfoRoute, params, true)
      );
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
      getShexText(shex).length > API.limits.byTextCharacterLimit
        ? API.sources.byText
        : shex.activeSource === API.sources.byFile
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
      history.push(
        mkPermalinkLong(API.routes.client.shexInfoRoute, lastParams)
      );
    }
    // Change current url for shareable links
    history.replace(mkPermalinkLong(API.routes.client.shexInfoRoute, params));

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
          title={API.texts.pageHeaders.shexInfo}
          details={API.texts.pageExplanations.shexInfo}
        />
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
                params={params}
                schemaEngine={API.engines.shex}
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

export default ShexInfo;
