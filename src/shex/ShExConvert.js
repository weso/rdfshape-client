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
import ResultShExConvert from "../results/ResultShExConvert";
import {
    getShexText,
    InitialShEx,
    mkShExTabs,
    paramsFromStateShEx,
    shExParamsFromQueryParams,
    updateStateShEx
} from "./ShEx";

function ShExConvert(props) {
  const [targetSchemaFormat, setTargetSchemaFormat] = useState(
    API.defaultShExFormat
  );
  const [shex, setShex] = useState(InitialShEx);

  const [result, setResult] = useState("");

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [permalink, setPermalink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const url = API.schemaConvert;

  function handleTargetSchemaFormatChange(value) {
    setTargetSchemaFormat(value);
  }

  useEffect(() => {
    if (props.location.search) {
      const queryParams = qs.parse(props.location.search);
      let paramsShEx = {};

      if (
        queryParams.schema ||
        queryParams.schemaURL ||
        queryParams.schemaFile
      ) {
        const schemaParams = shExParamsFromQueryParams(queryParams);
        const finalSchema = updateStateShEx(schemaParams, shex) || shex;
        setShex(finalSchema);
        paramsShEx = finalSchema;
      }

      if (queryParams.targetSchemaFormat)
        setTargetSchemaFormat(queryParams.targetSchemaFormat);

      let params = {
        ...paramsFromStateShEx(paramsShEx),
        schemaEngine: "ShEx",
        targetSchemaFormat:
          queryParams.targetSchemaFormat || targetSchemaFormat,
      };

      setParams(params);
      setLastParams(params);
    }
  }, [props.location.search]);

  useEffect(() => {
    if (params && !loading) {
      if (
        params.schema ||
        params.schemaURL ||
        (params.schemaFile && params.schemaFile.name)
      ) {
        resetState();
        setUpHistory();
        postConvert();
      } else {
        setError("No ShEx schema provided");
      }
      window.scrollTo(0, 0);
    }
  }, [params]);

  function handleSubmit(event) {
    event.preventDefault();
    setParams({
      ...paramsFromStateShEx(shex),
      schemaEngine: "ShEx",
      targetSchemaFormat,
    });
  }

  function postConvert(cb) {
    setLoading(true);
    setProgressPercent(20);
    const formData = params2Form(params);
    formData.append("targetSchemaFormat", targetSchemaFormat);

    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        setProgressPercent(70);
        setResult(data);
        setPermalink(mkPermalinkLong(API.shExConvertRoute, params));
        setProgressPercent(90);
        if (cb) cb();
        setProgressPercent(100);
      })
      .catch(function(error) {
        setError("Error calling server at " + url + ": " + error);
      })
      .finally(() => setLoading(false));
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
        mkPermalinkLong(API.shExConvertRoute, lastParams)
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.shExConvertRoute, params)
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
        <h1>ShEx: Convert ShEx schemas</h1>
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkShExTabs(shex, setShex, "ShEx Input")}
            <hr />
            <SelectFormat
              name="Target schema format"
              selectedFormat={targetSchemaFormat}
              handleFormatChange={handleTargetSchemaFormatChange}
              urlFormats={API.shExFormats}
            />
            <hr />
            <Button
              variant="primary"
              type="submit"
              className={"btn-with-icon " + (loading ? "disabled" : "")}
              disabled={loading}
            >
              Convert
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
              <ResultShExConvert
                result={result}
                permalink={permalink}
                disabled={
                  getShexText(shex).length > API.byTextCharacterLimit
                    ? API.byTextTab
                    : shex.activeTab === API.byFileTab
                    ? API.byFileTab
                    : false
                }
              />
            ) : null}
          </Col>
        ) : (
          <Col className={"half-col"}>
            <Alert variant="info">Conversion results will appear here</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default ShExConvert;
