import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect} from "react";
import Alert from "react-bootstrap/Alert";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button from "react-bootstrap/Button";
import API from "../API";
import Code from "../components/Code";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import $ from "jquery";
const cyto = require("cytoscape");
let dagre = require("cytoscape-dagre");
let svg = require('cytoscape-svg');
let panzoom = require("cytoscape-panzoom");

let cy = null;

function ResultXMI2ShEx(props) {
  let isFullscreen = false;
  const result = props.result;
  let msg;

  const [activeTab, setActiveTab] = useState(props.activeTab);

  function handleTabChange(e) {
    setActiveTab(e);
  }
  
  function fullscreen() {
		if(!isFullscreen) {
			$("#grafocontainer").attr("class", "fullscreen");
			$("#fullscreen").text("✖ Leave fullscreen");
			$("#grafoshex").css("max-height", "85%");
			isFullscreen = true;
		} else {
			$("#grafocontainer").removeAttr("class");
			$("#fullscreen").text("Show at fullscreen");
			$("#grafoshex").css("max-height", "500px");
			isFullscreen = false;
		}
	}
  
  useEffect(() => {
    let els = result.grafico;

	
    cyto.use(dagre);
	if (!cyto('core', 'svg')) {
		cyto.use(svg);
	}
	if (!cyto('core', 'panzoom')) {
		panzoom(cyto)
	}

    if (els != null) {
      cy = cyto({
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

	cy.panzoom( defaults ); //No funciona, por algún motivo extraño
	$("#descargargrafosvg").attr("download", `shumlex-graph.svg`);
	$("#descargargrafosvg").click(grafoASVG);
	$("#fullscreen").click(fullscreen);
    }
  });
  
  function grafoASVG() {
	var svgContent = cy.svg({scale: 1, full: true});
	let bs = btoa(svgContent);
	$("#descargargrafosvg").attr("href", `data:image/svg+xml;base64,${bs}`);
}
  
  

  if (result === "") {
    msg = null;
  } else if (result.error || result.msg.toLowerCase().includes("error")) {
    msg = (
      <div>
        <Alert variant="danger">Invalid XMI schema</Alert>
        <ul>
          <li className="word-break">{result.error || result.msg}</li>
        </ul>
      </div>
    );
  } else {
    msg = (
      <div>
        <Tabs
          activeKey={activeTab}
          transition={false}
          id="dataTabs"
          onSelect={handleTabChange}
        >
          <Tab eventKey={API.xmiTab} title="ShEx">
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
          <Tab eventKey={API.umlTab} title="ShEx Graph">
		  <div id="grafocontainer">
            <div
              id="grafoshex"
              style={{
                width: "100%",
                height: "650px",
                border: "double black",
                marginTop: "1em",
              }}
            ></div>
			<Button id="fullscreen" variant="secondary"  style={{margin: "0.5em"}}>Show at Fullscreen</Button>
			<a id="descargargrafosvg" className="btn btn-secondary">Download graph as SVG</a>
		   </div>
            <details id="jsongrafo">
              <PrintJson json={result.grafico} />
            </details>
          </Tab>
        </Tabs>
        {props.permalink && (
          <Fragment>
            <hr />
            <Permalink url={props.permalink} disabled={props.disabled} />
          </Fragment>
        )}
		<Alert variant="success" style={{marginTop: "0.5em"}}>Conversion successful</Alert>
      </div>
    );
  }

  return <div>{msg}</div>;
}

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
  
 var defaults = {
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
  animateOnFit: function(){ // whether to animate on fit
    return false;
  },
  fitAnimationDuration: 1000, // duration of animation on fit

  // icon class names
  sliderHandleIcon: 'fa fa-minus',
  zoomInIcon: 'fa fa-plus',
  zoomOutIcon: 'fa fa-minus',
  resetIcon: 'fa fa-expand'
};

ResultXMI2ShEx.propTypes = {
  result: PropTypes.object,
  mode: PropTypes.string,
};

export default ResultXMI2ShEx;
