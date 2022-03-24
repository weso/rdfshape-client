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
import {
  getDataText,
  mkDataServerParams,
  mkDataTabs,
  paramsFromStateData,
  updateStateData
} from "../data/Data";
import { mkPermalinkLong } from "../Permalink";
import ResultValidateShacl from "../results/ResultValidateShacl";
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

function ShaclValidate(props) {
  // Get all required data from state: data, schema
  const {
    rdfData: [ctxData],
    addRdfData,
    shaclSchema: ctxShacl,
  } = useContext(ApplicationContext);

  const history = useHistory();

  const [data, setData] = useState(ctxData || addRdfData());
  const [shacl, setShacl] = useState(ctxShacl || InitialShacl);

  const [result, setResult] = useState("");

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [permalink, setPermalink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  const url = API.routes.server.schemaValidate;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);

      const finalData = {
        index: 0,
        ...(updateStateData(queryParams, data) || data),
      };
      setData(finalData);

      const finalShacl = updateStateShacl(queryParams, shacl) || shacl;
      setShacl(finalShacl);

      const newParams = mkParams(finalData, finalShacl);
      setParams(newParams);
      setLastParams(newParams);
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params && !loading) {
      if (
        !(
          params[API.queryParameters.data.data] &&
          (params[API.queryParameters.data.source] == API.sources.byFile
            ? params[API.queryParameters.data.data].name
            : true)
        )
      )
        setError(API.texts.noProvidedRdf);
      else if (
        !(
          params[API.queryParameters.schema.schema] &&
          (params[API.queryParameters.schema.source] == API.sources.byFile
            ? params[API.queryParameters.schema.schema].name
            : true)
        )
      )
        setError(API.texts.noProvidedSchema);
      else {
        resetState();
        setUpHistory();
        postValidate();
      }
    }
  }, [params]);

  async function handleSubmit(event) {
    event.preventDefault();
    setParams(mkParams());
  }

  function mkParams(pData = data, pShacl = shacl) {
    return {
      ...paramsFromStateData(pData),
      ...paramsFromStateShacl(pShacl),
      [API.queryParameters.schema.triggerMode]: API.triggerModes.targetDecls, // SHACL Validation
    };
  }

  async function mkServerParams(pData = data, pShacl = shacl) {
    return {
      [API.queryParameters.data.data]: await mkDataServerParams(pData),
      [API.queryParameters.schema.schema]: await mkShaclServerParams(pShacl),
      // Trigger mode is just target declarations
      [API.queryParameters.schema.triggerMode]: {
        [API.queryParameters.type]: API.triggerModes.targetDecls,
      },
    };
  }

  async function postValidate() {
    setLoading(true);
    setProgressPercent(15);

    try {
      const paramsData = await mkServerParams();
      setProgressPercent(30);

      const { data: validateResponse } = await axios.post(url, paramsData);
      setResult(validateResponse);
      setProgressPercent(70);
      setPermalink(
        mkPermalinkLong(API.routes.client.shaclValidateRoute, params, true)
      );
      setProgressPercent(80);
      checkLinks();
    } catch (error) {
      setError(mkError(error, url));
    } finally {
      setLoading(false);
    }
  }

  // Disabled permalinks, etc. if the user input is too long or a file
  function checkLinks() {
    const disabled =
      getShaclText(shacl).length + getDataText(data).length >
      API.limits.byTextCharacterLimit
        ? API.sources.byText
        : data.activeSource === API.sources.byFile ||
          shacl.activeSource === API.sources.byFile
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
      history.push(
        mkPermalinkLong(API.routes.client.shaclValidateRoute, lastParams)
      );
    }
    // Change current url for shareable links
    history.replace(
      mkPermalinkLong(API.routes.client.shaclValidateRoute, params)
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
          title={API.texts.pageHeaders.shaclValidation}
          details={API.texts.pageExplanations.shaclValidation}
        />
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkDataTabs(data, setData)}
            <hr />
            {mkShaclTabs(shacl, setShacl)}
            <hr />
            <Button
              variant="primary"
              type="submit"
              className={"btn-with-icon " + (loading ? "disabled" : "")}
              disabled={loading}
            >
              {API.texts.actionButtons.validate}
            </Button>
          </Form>
        </Col>
        {loading || result || permalink || error ? (
          <Col className={"half-col"}>
            {loading ? (
              <ProgressBar
                className="width-100"
                striped
                animated
                variant="info"
                now={progressPercent}
              />
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : result ? (
              <ResultValidateShacl
                result={result}
                permalink={permalink}
                disabled={disabledLinks}
              />
            ) : null}
          </Col>
        ) : (
          <Col className={"half-col"}>
            <Alert variant="info">
              {API.texts.validationResultsWillAppearHere}
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default ShaclValidate;
