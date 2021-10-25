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
import {
  getDataText,
  InitialData,
  mkDataTabs,
  paramsFromStateData,
  updateStateData,
} from "../data/Data";
import { endpointParamsFromQueryParams } from "../endpoint/Endpoint";
import EndpointInput from "../endpoint/EndpointInput";
import { mkPermalinkLong, params2Form } from "../Permalink";
import ResultValidateShacl from "../results/ResultValidateShacl";
import { mkError } from "../utils/ResponseError";
import { dataParamsFromQueryParams } from "../utils/Utils";
import {
  getShaclText,
  InitialShacl,
  mkShaclTabs,
  paramsFromStateShacl,
  shaclParamsFromQueryParams,
  updateStateShacl,
} from "./SHACL";

function SHACLValidate(props) {
  const [shacl, setShacl] = useState(InitialShacl);
  const [data, setData] = useState(InitialData);

  const [endpoint, setEndpoint] = useState("");
  const [withEndpoint, setWithEndpoint] = useState(false);

  const [result, setResult] = useState("");

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [permalink, setPermalink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  const url = API.schemaValidate;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      let paramsData,
        paramsShacl,
        paramsEndpoint = {};

      if (queryParams.data || queryParams.dataUrl || queryParams.dataFile) {
        const dataParams = dataParamsFromQueryParams(queryParams);
        const finalData = updateStateData(dataParams, data) || data;
        paramsData = finalData;
        setData(finalData);
      }
      if (
        queryParams.schema ||
        queryParams.schemaUrl ||
        queryParams.schemaFile
      ) {
        const shaclParams = shaclParamsFromQueryParams(queryParams);
        const finalSchema = updateStateShacl(shaclParams, shacl) || shacl;
        paramsShacl = finalSchema;
        setShacl(finalSchema);
      }

      // Endpoint State
      if (queryParams.endpoint) {
        paramsEndpoint = endpointParamsFromQueryParams(queryParams);
        setEndpoint(paramsEndpoint.endpoint);
        setWithEndpoint(!!paramsEndpoint.endpoint);
      }

      let params = {
        ...paramsFromStateData(paramsData),
        ...paramsFromStateShacl(paramsShacl),
        endpoint: paramsEndpoint.endpoint ? paramsEndpoint.endpoint : "",
        schemaEngine: queryParams.schemaEngine || shacl.engine,
        triggerMode: "targetDecls",
      };

      setParams(params);
      setLastParams(params);
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params && !loading) {
      if (!(params.data || params.dataUrl || params.dataFile))
        setError("No RDF data provided");
      else if (!(params.schema || params.schemaUrl || params.schemaFile))
        setError("No SHACL schema provided");
      else {
        resetState();
        setUpHistory();
        postValidate();
      }
      window.scrollTo(0, 0);
    }
  }, [params]);

  function handleEndpointChange(value) {
    setEndpoint(value.trim());
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const paramsEndpoint = {};
    if (endpoint !== "") {
      paramsEndpoint["endpoint"] = endpoint.trim();
    }

    setParams({
      ...paramsFromStateShacl(shacl),
      ...paramsFromStateData(data),
      ...paramsEndpoint,
      schemaEngine: shacl.engine,
      triggerMode: "targetDecls",
    });
  }

  function postValidate(cb) {
    setLoading(true);
    setProgressPercent(15);
    const formData = params2Form(params);
    setProgressPercent(30);

    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        setResult(data);
        setProgressPercent(70);
        setPermalink(mkPermalinkLong(API.shaclValidateRoute, params));
        setProgressPercent(80);
        checkLinks();
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
      getShaclText(shacl).length + getDataText(data).length >
      API.byTextCharacterLimit
        ? API.byTextTab
        : data.activeTab === API.byFileTab || shacl.activeTab === API.byFileTab
        ? API.byFileTab
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
        mkPermalinkLong(API.shaclValidateRoute, lastParams)
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.shaclValidateRoute, params)
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
    <Container>
      <Row>
        <h1>Validate RDF data with SHACL</h1>
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkDataTabs(data, setData, "RDF input")}
            <Button
              variant="secondary"
              onClick={() => {
                setWithEndpoint(!withEndpoint);
                if (!withEndpoint === false) {
                  setEndpoint("");
                }
              }}
            >
              {withEndpoint ? "Remove" : "Add"} endpoint
            </Button>
            {withEndpoint ? (
              <EndpointInput
                value={endpoint}
                handleOnChange={handleEndpointChange}
              />
            ) : null}
            <hr />
            {mkShaclTabs(shacl, setShacl, "Shapes graph (SHACL)")}
            <hr />
            <Button
              variant="primary"
              type="submit"
              className={"btn-with-icon " + (loading ? "disabled" : "")}
              disabled={loading}
            >
              Validate
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
            <Alert variant="info">Validation results will appear here</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default SHACLValidate;
