import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import shumlex from "shumlex";
import API from "../API";
import Code from "../components/Code";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import { format2mode } from "../utils/Utils";
import ShowVisualization, {
  visualizationTypes
} from "../visualization/ShowVisualization";

function ResultShEx2XMI({
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

  const dummyId = "dummy-uml-placeholder";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [svg, setSvg] = useState("");

  function handleTabChange(e) {
    setActiveTab(e);
  }

  // useEffect(() => setSvg(mkSvgElement()), []);

  const mkSvgElement = () => {
    // Create a dummy HTML element to put the SVG into
    const dummy = document.createElement("div");
    dummy.id = dummyId;
    document.body.appendChild(dummy);

    // Use Shumlex to create the SVG data (binary)...
    shumlex.crearDiagramaUML(dummyId, resultRaw);
    let svg64 = shumlex.base64SVG(dummyId);
    // ...and decode the binary to get the inline SVG element to be represented
    const inlineSvg = Buffer.from(
      svg64.replace("data:image/svg+xml;base64,", ""),
      "base64"
    ).toString();

    // Remove dummy element and return
    dummy.remove();

    return inlineSvg;
  };

  if (conversionResult)
    return (
      <div>
        <Tabs activeKey={activeTab} id="dataTabs" onSelect={handleTabChange}>
          <Tab eventKey={API.tabs.xmi} title={API.texts.misc.xmi}>
            {resultRaw && (
              <Code
                value={resultRaw}
                mode={format2mode(resultMode)}
                onChange={function(val) {
                  return val;
                }}
              />
            )}
          </Tab>
          <Tab
            eventKey={API.tabs.visualization}
            title={API.texts.misc.umlDiagram}
            onEnter={() => !svg && setSvg(mkSvgElement())}
          >
            <div className="visual-column">
              <ShowVisualization
                data={svg}
                type={visualizationTypes.svgRaw}
                raw={false}
                zoom={1}
                embedLink={false}
                disabledLinks={disabled}
              />
            </div>
            {/* <div id="uml-placeholder">
              <div
                id="umlcd"
                style={{ overflowX: "auto", border: "double black" }}
              ></div>
              <Button
                id="fullscreen"
                variant="secondary"
                style={{ margin: "0.5em" }}
              >
                {API.texts.enableFullscreen}
              </Button>
              <a id="descargarumlsvg" className="btn btn-secondary">
                {API.texts.misc.download}
              </a>
            </div> */}
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
      </div>
    );
}

ResultShEx2XMI.propTypes = {
  result: PropTypes.object,
  resultMode: PropTypes.string,
  initialTab: PropTypes.string,
};

ResultShEx2XMI.defaultProps = {
  resultMode: API.formats.xml, // Mode of the result textArea
  initialTab: API.tabs.xmi, // Key of the initially active tab
};

export default ResultShEx2XMI;
