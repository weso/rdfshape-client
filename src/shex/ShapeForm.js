import axios from "axios";
import $ from "jquery";
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
import API from "../API";
import { mkPermalinkLong } from "../Permalink";
import ResultShapeForm from "../results/ResultShapeForm";
import ShexParser from "./shapeform/ShExParser.js";
import {
    convertTabSchema,
    getShexText,
    InitialShEx,
    mkShExTabs,
    shExParamsFromQueryParams,
    updateStateShEx
} from "./ShEx";

export default function ShEx2XMI(props) {
  const [shex, setShEx] = useState(InitialShEx);
  const [targetFormat, setTargetFormat] = useState("RDF/XML");

  const [result, setResult] = useState("");

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [permalink, setPermalink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const fetchUrl = API.fetchUrl;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      let paramsShEx = {};

      if (
        queryParams.schema ||
        queryParams.schemaURL ||
        queryParams.schemaFile
      ) {
        const schemaParams = shExParamsFromQueryParams(queryParams);
        const finalSchema = updateStateShEx(schemaParams, shex) || shex;

        paramsShEx = finalSchema;
        setShEx(finalSchema);
      }

      if (queryParams.targetSchemaFormat)
        setTargetFormat(queryParams.targetSchemaFormat);

      const params = {
        ...mkServerParams(
          paramsShEx,
          queryParams.targetSchemaFormat || "TURTLE"
        ),
        schemaEngine: "ShEx",
        targetSchemaEngine: "SHACL",
      };

      setParams(params);
      setLastParams(params);
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params && !loading) {
      if (
        params.schema ||
        params.schemaURL ||
        (params.schemaFile && params.schemaFile.name)
      ) {
        resetState();
        setUpHistory();
        doRequest();
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
        return "xml";
    }
  }

  function mkServerParams(source, format) {
    let params = {};
    params["activeSchemaTab"] = convertTabSchema(source.activeTab);
    params["schemaEmbedded"] = false;
    params["schemaFormat"] = source.format;
    switch (source.activeTab) {
      case API.byTextTab:
        params["schema"] = source.textArea;
        params["schemaFormatTextArea"] = source.format;
        break;
      case API.byUrlTab:
        params["schemaURL"] = source.url;
        params["schemaFormatUrl"] = source.format;
        break;
      case API.byFileTab:
        params["schemaFile"] = source.file;
        params["schemaFormatFile"] = source.format;
        break;
      default:
    }

    if (format) {
      setTargetFormat(format);
      params["targetSchemaFormat"] = format;
    } else params["targetSchemaFormat"] = targetFormat;
    return params;
  }

  function handleSubmit(event) {
    event.preventDefault();
    let newParams = {};
      newParams = {
        ...mkServerParams(shex, "xml"),
        schemaEngine: "ShEx",
        targetSchemaEngine: "xml",
      };

    setParams(newParams);
  }

  // This validation is done in the client, so the client must parse the input,
  // wether it's plain text, a URL to be fetched or a file to be parsed.
  async function getConverterInput() {
    // Plain text, do nothing
    if (params.schema) return params.schema;
    else if (params.schemaURL) {
      // URL, ask the RdfShape server to fetch the contents for us (prevent CORS)
      return axios
        .get(fetchUrl, {
          params: { url: params.schemaURL },
        })
        .then((res) => res.data)
        .catch((err) => {
          console.error(err);
          return `Error accessing URL. $err`;
        });
    } else if (params.schemaFile) {
      // File upload, read the file and return the raw text
      return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result);
        reader.readAsText(params.schemaFile);
      }).then();
    }
  }

  async function doRequest(cb) {
    setLoading(true);
    setProgressPercent(20);
    let res = "";
    try {
      const input = await getConverterInput();

	  let sp = new ShexParser();
      res = sp.parseShExToForm(input);
	  
      setProgressPercent(90);
      let result = { result: res, msg: "Succesful generation"};
      setResult(result);
      setPermalink(
        mkPermalinkLong(API.shapeFormRoute, {
          schema: params.schema || undefined,
          schemaURL: params.schemaURL || undefined,
          schemaFile: params.schemaFile || undefined,
          targetSchemaEngine: params.targetSchemaEngine,
        })
      );
      setProgressPercent(100);
    } catch (error) {
		setError(
            `An error has occurred while creating the Form equivalent. Check the input.\n${error}`
          )
    } finally {
      setLoading(false);
    }
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
        mkPermalinkLong(API.shapeFormRoute, {
          schema: lastParams.schema || undefined,
          schemaURL: lastParams.schemaURL || undefined,
          schemaFile: lastParams.schemaFile || undefined,
          targetSchemaEngine: lastParams.targetSchemaEngine,
        })
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.shapeFormRoute, {
        schema: params.schema || undefined,
        schemaURL: params.schemaURL || undefined,
        schemaFile: params.schemaFile || undefined,
        targetSchemaEngine: params.targetSchemaEngine || undefined,
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
            <h1>Create Form from ShEx</h1>
          </Row>
          <Row>
            <Col className={"half-col border-right"}>
              <Form onSubmit={handleSubmit}>
                {mkShExTabs(shex, setShEx, "ShEx Input")}
                <hr />
                <Button
                  variant="primary"
                  type="submit"
                  className={"btn-with-icon " + (loading ? "disabled" : "")}
                  disabled={loading}
                >
                  Create Form
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
                    mode={targetFormatMode("xml")}
                    permalink={permalink}
                    disabled={
                      getShexText(shex).length > API.byTextCharacterLimit
                        ? API.byTextTab
                        : shex.activeTab === API.byFileTab
                        ? API.byFileTab
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
                  Conversion results will appear here
                </Alert>
              </Col>
            )}
          </Row>
        </>
    </Container>
  );
}
