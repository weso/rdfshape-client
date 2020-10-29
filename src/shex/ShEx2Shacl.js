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
import { mkPermalink, mkPermalinkLong, params2Form } from "../Permalink";
import ResultShEx2Shacl from "../results/ResultShEx2Shacl";
import {
  convertTabSchema,
  InitialShEx,
  mkShExTabs,
  shExParamsFromQueryParams,
  updateStateShEx
} from "./ShEx";

export default function ShEx2Shacl(props) {
  const [shex, setShEx] = useState(InitialShEx);
  const [targetFormat, setTargetFormat] = useState(API.defaultSHACLFormat);

  const [result, setResult] = useState("");

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [permalink, setPermalink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const url = API.schemaConvert;

  useEffect(() => {
    if (props.location.search) {
      const queryParams = qs.parse(props.location.search);
      let paramsShEx = {};

      if (
        queryParams.schema ||
        queryParams.shExUrl ||
        queryParams.schemaFile
      ) {
        const schemaParams = shExParamsFromQueryParams(queryParams);
        const finalSchema = updateStateShEx(schemaParams, shex) || shex;
        console.log("PARSED SCHEMA: ", finalSchema)

        setShEx(finalSchema);
        paramsShEx = finalSchema;
      }

      // let params = {
      //   ...paramsShEx,
      //   ...mkServerParams(queryParams.targetFormat),
      //   schema: queryParams.schema,
      //   schemaEngine: "ShEx",
      //   targetSchemaEngine: "SHACL",
      // };

      let params = {
        ...mkServerParams(queryParams.targetFormat || "TURTLE"),
        schemaEngine: "ShEx",
        targetSchemaEngine: "SHACL",
      }

      setParams(params);
      setLastParams(params);
    }
  }, [props.location.search]);

  useEffect(() => {
    if (params && !loading) {
      if (params.schema || params.schemaURL || params.schemaFile) {
        console.log("SENT PARAMS:", params)

        resetState();
        setUpHistory();
        postRequest();
      } else {
        setError("No ShEx schema provided");
      }
      window.scrollTo(0, 0);
    }
  }, [params]);

  function targetFormatMode(targetFormat) {
    switch (targetFormat.toUpperCase()) {
      case "TURTLE":
        return "turtle";
      case "RDF/XML":
        return "xml";
      case "TRIG":
        return "xml";
      case "JSON-LD":
        return "javascript";
      default:
        return "turtle";
    }
  }

  function mkServerParams(format) {
    let params = {};
    params["activeSchemaTab"] = convertTabSchema(shex.activeTab);
    params["schemaEmbedded"] = false;
    params["schemaFormat"] = shex.format;
    switch (shex.activeTab) {
      case API.byTextTab:
        params["schema"] = shex.textArea;
        params["schemaFormatTextArea"] = shex.format;
        break;
      case API.byUrlTab:
        params["schemaURL"] = shex.url;
        params["schemaFormatUrl"] = shex.format;
        break;
      case API.byFileTab:
        params["schemaFile"] = shex.file;
        params["schemaFormatFile"] = shex.format;
        break;
      default:
    }

    if (format) {
      setTargetFormat(format);
      params["targetSchemaFormat"] = format;
    } else params["targetSchemaFormat"] = targetFormat;
    return params;
  }

  function queryParamsFromServerParams(params) {
    let queryParams = {};
    if (params["schema"]) {
      queryParams["schema"] = params["schema"];
    }
    if (params["schemaURL"]) {
      queryParams["shExUrl"] = params["schemaURL"];
    }
    if (params["schemaFormat"]) {
      queryParams["shExFormat"] = params["schemaFormat"];
    }
    if (params["targetSchemaFormat"]) {
      queryParams["targetFormat"] = params["targetSchemaFormat"];
    }
    return queryParams;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setParams({
      ...mkServerParams(),
      schemaEngine: "ShEx",
      targetSchemaEngine: "SHACL",
    });
  }

  function postRequest(cb) {
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
          await mkPermalink(
            API.shEx2ShaclRoute,
            queryParamsFromServerParams(params)
          )
        );
        setProgressPercent(90);
        if (cb) cb();
        setProgressPercent(100);
      })
      .catch(function(error) {
        setError(
          `Error calling server at ${url}: ${error}\n. Try again later.`
        );
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
        mkPermalinkLong(
          API.shEx2ShaclRoute,
          queryParamsFromServerParams(lastParams)
        )
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.shEx2ShaclRoute, queryParamsFromServerParams(params))
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
        <h1>Convert ShEx to SHACL</h1>
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkShExTabs(shex, setShEx, "ShEx Input")}
            <hr />
            <SelectFormat
              name="SHACL format"
              defaultFormat="TURTLE"
              handleFormatChange={(value) => setTargetFormat(value)}
              urlFormats={API.shaclFormats}
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
              <ResultShEx2Shacl
                result={result}
                mode={targetFormatMode(targetFormat)}
                permalink={!params.schemaFile && permalink}
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
