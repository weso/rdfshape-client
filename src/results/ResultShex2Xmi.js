import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState, componentDidMount } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import API from "../API";
import ByText from "../components/ByText";
import { mkEmbedLink, Permalink } from "../Permalink";
import { InitialUML, mkSvgElement, paramsFromStateUML } from "../uml/UML";
import PrintJson from "../utils/PrintJson";
import $ from "jquery";
import shumlex from "shumlex";
import {
  format2mode,
  scrollToResults,
  yasheResultButtonsOptions
} from "../utils/Utils";
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
  const { result: resultRaw } = conversionResult;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [svg, setSvg] = useState();
  const [svgId, setSvgId] = useState();

  // Params of the created uml, used to create the embed link
  const umlParams = paramsFromStateUML({
    ...InitialUML,
    activeSource: API.sources.byText,
    textArea: resultRaw,
  });

  useEffect(scrollToResults, []);
  
  if(!svg) {
	  setSvg(mkSvgElement(resultRaw).replaceAll("�enumeration�", "«enumeration»"));  
  }
  
  useEffect(() => {
	  setSvgId(svg.match(/mermaid-[0-9]*/i)[0]);
	  shumlex.asignarEventos(svgId);	  
  });

  if (conversionResult)
    return (
      <div id={API.resultsId}>
        <Tabs
		defaultActiveKey={API.tabs.visualization}
          activeKey={API.tabs.visualization}
          id="dataTabs"
          onSelect={(e) => setActiveTab(e)}
        >
		  <Tab
            eventKey={API.tabs.visualization}
            title={API.texts.misc.umlDiagram}
          >
            <div>
              <ShowVisualization
                data={svg}
                type={visualizationTypes.svgRaw}
                embedLink={mkEmbedLink(umlParams, {
                  visualizationType:
                    API.queryParameters.visualization.types.uml,
                  visualizationTarget:
                    API.queryParameters.visualization.targets.svg,
                })} 
              />
            </div>
          </Tab>
          <Tab eventKey={API.tabs.xmi} title={API.texts.misc.xmi}>
            {resultRaw && (
              <ByText
                textAreaValue={resultRaw}
                textFormat={format2mode(resultMode)}
                fromParams={false}
                handleByTextChange={function(val) {
                  return val;
                }}
                readonly={true}
                options={{ ...yasheResultButtonsOptions }}
              />
            )}
          </Tab>
          
        </Tabs>

        <hr />

        <details>
          <summary>{API.texts.responseSummaryText}</summary>
          <PrintJson json={conversionResult} />
        </details>
        {permalink && (
          <Fragment>
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
