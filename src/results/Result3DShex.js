import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState, componentDidMount } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import API from "../API";
import ByText from "../components/ByText";
import { mkEmbedLink, Permalink } from "../Permalink";
import { InitialUML, paramsFromStateUML } from "../uml/UML";
import PrintJson from "../utils/PrintJson";
import $ from "jquery";
import shExTo3D from "3dshex";
import {
  format2mode,
  scrollToResults,
  yasheResultButtonsOptions
} from "../utils/Utils";

function Result3DShex({
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
  
  useEffect(() => {
	  shExTo3D(resultRaw, "3dgraph");	  
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
            title={API.texts.misc.graph3d}
          >
            <div id="3dgraph">
            </div>
          </Tab>
          
        </Tabs>

        <hr />

        <details>
          <summary>{API.texts.responseSummaryText}</summary>
        </details>
        {permalink && (
          <Fragment>
            <Permalink url={permalink} disabled={disabled} />
          </Fragment>
        )}
      </div>
    );
}

Result3DShex.propTypes = {
  result: PropTypes.object,
  resultMode: PropTypes.string,
  initialTab: PropTypes.string,
};

Result3DShex.defaultProps = {
  resultMode: API.formats.tresd, // Mode of the result textArea
  initialTab: API.tabs.visualization, // Key of the initially active tab
};

export default Result3DShex;
