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
import shumlex from "shumlex";
import API from "../API";
import { mkPermalinkLong } from "../Permalink";
import ResultShEx2XMI from "../results/ResultShEx2XMI";
import ResultXMI2ShEx from "../results/ResultXMI2ShEx";
import {
    convertTabSchema,
    InitialShEx,
    mkShExTabs,
    shExParamsFromQueryParams
} from "../uml/ShEx2UML";
import {
    getUmlText,
    InitialUML,
    mkUMLTabs,
    UMLParamsFromQueryParams,
    updateStateUML
} from "../uml/UML";
import { getShexText, updateStateShEx } from "./ShEx";
const cyto = require("cytoscape");
let dagre = require("cytoscape-dagre");
const panzoom = require("cytoscape-panzoom");

export default function ShEx2XMI(props) {
  const [shex, setShEx] = useState(InitialShEx);
  const [xmi, setXmi] = useState(InitialUML);
  const [targetFormat, setTargetFormat] = useState("RDF/XML");

  const [result, setResult] = useState("");

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [permalink, setPermalink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const fetchUrl = API.fetchUrl;

  const [isShEx2UML, setIsShEx2UML] = useState(true);

  const style = [
    //Hoja de estilo para el grafo
    {
      selector: "node",
      style: {
        "background-color": "purple",
        "background-opacity": "0.1",
        label: "data(name)",
        "text-valign": "center",
        "font-family": "CaslonAntique",
      },
    },

    {
      selector: "edge",
      style: {
        width: 3,
        "line-color": "#ccc",
        "target-arrow-color": "#ccc",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        label: "data(name)",
        "font-family": "CaslonAntique",
      },
    },
  ];

  const defaults = {
    zoomFactor: 0.05, // zoom factor per zoom tick
    zoomDelay: 45, // how many ms between zoom ticks
    minZoom: 0.1, // min zoom level
    maxZoom: 10, // max zoom level
    fitPadding: 50, // padding when fitting
    panSpeed: 10, // how many ms in between pan ticks
    panDistance: 10, // max pan distance per tick
    panDragAreaSize: 75, // the length of the pan drag box in which the vector for panning is calculated (bigger = finer control of pan speed and direction)
    panMinPercentSpeed: 0.25, // the slowest speed we can pan by (as a percent of panSpeed)
    panInactiveArea: 8, // radius of inactive area in pan drag box
    panIndicatorMinOpacity: 0.5, // min opacity of pan indicator (the draggable nib); scales from this to 1.0
    zoomOnly: false, // a minimal version of the ui only with zooming (useful on systems with bad mousewheel resolution)
    fitSelector: undefined, // selector of elements to fit
    animateOnFit: function() {
      // whether to animate on fit
      return false;
    },
    fitAnimationDuration: 1000, // duration of animation on fit

    // icon class names
    sliderHandleIcon: "fa fa-minus",
    zoomInIcon: "fa fa-plus",
    zoomOutIcon: "fa fa-minus",
    resetIcon: "fa fa-expand",
  };

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      let paramsShEx = {};
      let shex2Uml = isShEx2UML;

      // Deduce conversion direction from URL
      if (queryParams.targetSchemaEngine) {
        if (queryParams.targetSchemaEngine === "xml") shex2Uml = true;
        else shex2Uml = false;
        setIsShEx2UML(shex2Uml);
      }

      if (
        queryParams.schema ||
        queryParams.schemaURL ||
        queryParams.schemaFile
      ) {
        const schemaParams = shex2Uml
          ? shExParamsFromQueryParams(queryParams)
          : UMLParamsFromQueryParams(queryParams);

        const finalSchema = shex2Uml
          ? updateStateShEx(schemaParams, shex) || shex
          : updateStateUML(schemaParams, xmi) || xmi;

        paramsShEx = finalSchema;
        shex2Uml ? setShEx(finalSchema) : setXmi(finalSchema);
      }

      const params = {
        // ...paramsShEx,
        ...mkServerParams(paramsShEx, queryParams.targetSchemaEngine),
        schemaEngine: shex2Uml ? "ShEx" : "xml",
        targetSchemaEngine: shex2Uml ? "xml" : "ShEx",
        targetSchemaFormat: shex2Uml ? "xml" : "ShEx",
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

  useEffect(() => {
    let json = $("#jsongrafo pre").text();
    let els = null;

    if (json !== "") {
      els = JSON.parse(json);
    }
    cyto.use(dagre);
    //panzoom( cyto );

    if (els != null) {
      let cy = cyto({
        container: document.getElementById("grafoshex"), // Contenedor

        elements: els,

        style: style,

        layout: {
          name: "dagre",
          nodeSep: 60,
          edgeSep: 40,
          rankSep: 80,
        },
      });
      //cy.panzoom( defaults );
    }
  }, [result]);

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
    if (isShEx2UML) {
      newParams = {
        ...mkServerParams(shex, "xml"),
        schemaEngine: "ShEx",
        targetSchemaEngine: "xml",
      };
    } else {
      newParams = {
        ...mkServerParams(xmi, "ShEx"),
        schemaEngine: "xml",
        targetSchemaEngine: "ShEx",
      };
    }

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
    let grf = "";
	let uml = null;
    try {
      const input = await getConverterInput();

      if (isShEx2UML) {
        res = shumlex.shExToXMI(input);
      } else {
        res = shumlex.XMIToShEx(input);
        grf = shumlex.crearGrafo(res);
      }
      setProgressPercent(90);
      let result = { result: res, grafico: grf, msg: "Succesful conversion"};
      setResult(result);
      setPermalink(
        mkPermalinkLong(API.shEx2XMIRoute, {
          schema: params.schema || undefined,
          schemaURL: params.schemaURL || undefined,
          schemaFile: params.schemaFile || undefined,
          targetSchemaEngine: params.targetSchemaEngine,
        })
      );
      setProgressPercent(100);
    } catch (error) {
      isShEx2UML
        ? setError(
            `An error has occurred while creating the UML equivalent. Check the input.\n${error}`
          )
        : setError(
            `An error has occurred while creating the ShEx equivalent. Check the input.\n${error}`
          );
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
        mkPermalinkLong(API.shEx2XMIRoute, {
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
      mkPermalinkLong(API.shEx2XMIRoute, {
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

  $("#uml2shex").click(loadOppositeConversion);
  $("#shex2uml").click(loadOppositeConversion);

  function loadOppositeConversion() {
    resetState();
    setIsShEx2UML(!isShEx2UML);
  }

  return (
    <Container fluid={true}>
      {isShEx2UML && (
        <>
          <Row>
            <h1>Convert ShEx to UML</h1>
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
                  Convert to UML
                </Button>
              </Form>
              <Button
                id="uml2shex"
                variant="secondary"
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
                  <ResultShEx2XMI
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
      )}
      {!isShEx2UML && (
        <>
          <Row>
            <h1>Convert UML to ShEx</h1>
          </Row>
          <Row>
            <Col className={"half-col border-right"}>
              <Form onSubmit={handleSubmit}>
                {mkUMLTabs(xmi, setXmi, "UML Input")}
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
                  <ResultXMI2ShEx
                    result={result}
                    mode={targetFormatMode("TURTLE")}
                    permalink={permalink}
                    activeTab="XMI"
                    disabled={
                      getUmlText(xmi).length > API.byTextCharacterLimit
                        ? API.byTextTab
                        : xmi.activeTab === API.byFileTab
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
      )}
    </Container>
  );
}
