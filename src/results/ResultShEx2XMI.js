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
  const result = props.result;
  let msg;

  const [activeTab, setActiveTab] = useState(props.activeTab);

  function handleTabChange(e) {
    setActiveTab(e);
  }
  
    useEffect(() => { 
		shumlex.crearDiagramaUML("umlcd", result.result);
		let svg64 = shumlex.base64SVG("umlcd");
		$("#descargarumlsvg").attr("href", svg64);
		$("#descargarumlsvg").attr("download", `shumlex-class-diagram.svg`);
	});

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
        <Alert variant="success">Conversion successful</Alert>
        <Tabs
          activeKey={activeTab}
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
              <PrintJson json={result} />
            </details>
          </Tab>
          <Tab eventKey={API.umlTab} title="UML Diagram">
           <div id="umlcd" style={{overflowX: 'auto'}}></div>
          </Tab>
        </Tabs>
        {props.permalink && (
          <Fragment>
            <hr />
            <Permalink url={props.permalink} disabled={props.disabled} />
			<a id="descargarumlsvg" class="btn btn-secondary">Descargar SVG</a>
          </Fragment>
        )}
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
