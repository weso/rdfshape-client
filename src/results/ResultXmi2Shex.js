import $ from "jquery";
import PropTypes from "prop-types";
import React, { Fragment, useRef, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import API from "../API";
import Code from "../components/Code";
import { Permalink } from "../Permalink";
import { breadthfirst } from "../utils/cytoscape/cytoUtils";
import PrintJson from "../utils/PrintJson";
import { format2mode } from "../utils/Utils";
import ShowVisualization, {
  visualizationTypes
} from "../visualization/ShowVisualization";
const cyto = require("cytoscape");
let dagre = require("cytoscape-dagre");
let svg = require("cytoscape-svg");
let panzoom = require("cytoscape-panzoom");

let cy = null;

function ResultXMI2ShEx({
  result: conversionResult,
  resultMode,
  initialTab,
  permalink,
  disabled,
}) {
  const {
    result: resultRaw,
    graph: resultGraph,
    msg: resultMessage,
  } = conversionResult;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const refCyto = useRef(null);

  function handleTabChange(e) {
    setActiveTab(e);
  }

  function fullscreen() {
    if (!isFullscreen) {
      $("#grafocontainer").attr("class", "fullscreen");
      $("#fullscreen").text(API.texts.leaveFullscreen);
      $("#grafoshex").css("max-height", "85%");
      setIsFullscreen(true);
    } else {
      $("#grafocontainer").removeAttr("class");
      $("#fullscreen").text(API.texts.enableFullscreen);
      $("#grafoshex").css("max-height", "500px");
      setIsFullscreen(false);
    }
  }



  if (conversionResult)
    return (
      <>
        <Tabs activeKey={activeTab} id="dataTabs" onSelect={handleTabChange}>
          <Tab eventKey={API.tabs.shex} title={API.texts.misc.shex}>
            {resultRaw && (
              <Code
                value={resultRaw}
                mode={format2mode(resultMode)} // ShExC represent as Turtle
                onChange={function(val) {
                  return val;
                }}
              />
            )}
          </Tab>
          <Tab eventKey={API.tabs.visualization} title={API.texts.misc.graph}>
            <div className="visual-column">
              <ShowVisualization
                data={{
                  layout: breadthfirst,
                  elements: resultGraph,
                  refCyto,
                  stylesheet: visualizationStyle,
                }}
                type={visualizationTypes.cytoscape}
                raw={false}
                zoom={1}
                embedLink={false}
                disabledLinks={disabled}
              />
            </div>
          </Tab>
        </Tabs>
        <details>
          <summary>{API.texts.responseSummaryText}</summary>
          <PrintJson json={conversionResult} />
        </details>
        {permalink && (
          <Fragment>
            <hr />
            <Permalink url={permalink} disabled={disabled} />
          </Fragment>
        )}
      </>
    );
}

const visualizationStyle = [
  // Additional styles and settings for the cytoscape graph
  {
    selector: "node",
    style: {
      label: "data(name)", // Use the "name" attribute of each element as its label
    },
  },
];

ResultXMI2ShEx.propTypes = {
  result: PropTypes.object,
  resultMode: PropTypes.string,
  initialTab: PropTypes.string,
};

ResultXMI2ShEx.defaultProps = {
  resultMode: API.formats.turtle, // Mode of the result textArea
  initialTab: API.tabs.shex, // Key of the initially active tab
};

export default ResultXMI2ShEx;
