import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";
import Tabs from "react-bootstrap/Tabs";
import API from "../API";
import Code from "../components/Code";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import shumlex from "shumlex";
import $ from "jquery";

function ResultShEx2XMI(props) {
  let isFullscreen = false;
  const result = props.result;
  let msg;

  const [activeSource, setActiveSource] = useState(props.activeSource);

  function handleTabChange(e) {
    setActiveSource(e);
  }

  useEffect(() => {
    shumlex.crearDiagramaUML("umlcd", result.result);
    let svg64 = shumlex.base64SVG("umlcd");
    $("#descargarumlsvg").attr("href", svg64);
    $("#descargarumlsvg").attr("download", `shumlex-class-diagram.svg`);
    $("#fullscreen").click(fullscreen);
  });

  function fullscreen() {
    if (!isFullscreen) {
      $("#umlcontainer").attr("class", "fullscreen");
      $("#fullscreen").text("✖ Leave fullscreen");
      $("#umlcd").css("max-height", "91%");
      isFullscreen = true;
    } else {
      $("#umlcontainer").removeAttr("class");
      $("#fullscreen").text("Show at fullscreen");
      $("#umlcd").css("max-height", "500px");
      isFullscreen = false;
    }
  }

  if (result === "") {
    msg = null;
  } else if (result.error || result.msg.toLowerCase().includes("error")) {
    msg = (
      <div>
        <Alert variant="danger">Invalid ShEx schema</Alert>
        <ul>
          <li className="word-break">{result.error || result.msg}</li>
        </ul>
      </div>
    );
  } else {
    msg = (
      <div>
        <Tabs
          activeKey={activeSource}
          transition={false}
          id="dataTabs"
          onSelect={handleTabChange}
        >
          <Tab eventKey={API.xmiTab} title="XMI">
            {result.result && (
              <Code
                value={result.result}
                mode={props.mode}
                onChange={function(val) {
                  return val;
                }}
              />
            )}
            <details>
              <summary>{API.responseSummaryText}</summary>
              <PrintJson json={result} />
            </details>
          </Tab>
          <Tab eventKey={API.umlTab} title="UML Diagram">
            <div id="umlcontainer">
              <div
                id="umlcd"
                style={{ overflowX: "auto", border: "double black" }}
              ></div>
              <Button
                id="fullscreen"
                variant="secondary"
                style={{ margin: "0.5em" }}
              >
                Show at Fullscreen
              </Button>
              <a id="descargarumlsvg" className="btn btn-secondary">
                Download UML as SVG
              </a>
            </div>
          </Tab>
        </Tabs>
        {props.permalink && (
          <Fragment>
            <hr />
            <Permalink url={props.permalink} disabled={props.disabled} />
          </Fragment>
        )}
        <Alert variant="success" style={{ marginTop: "0.5em" }}>
          Conversion successful
        </Alert>
      </div>
    );
  }

  return <div>{msg}</div>;
}

ResultShEx2XMI.propTypes = {
  result: PropTypes.object,
  mode: PropTypes.string,
};

export default ResultShEx2XMI;
