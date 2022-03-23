import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import API from "../API";
import { Permalink } from "../Permalink";
import { InitialUML, paramsFromStateUML } from "../uml/UML";
import PrintJson from "../utils/PrintJson";
import { scrollToResults } from "../utils/Utils";
import ShowVisualization, {
  visualizationTypes
} from "../visualization/ShowVisualization";

function Result3DShex({
  result: conversionResult,
  resultMode,
  initialTab,
  permalink,
  disabled,
  // Since 3dshex is generated in the result component, let this component know how to
  // update errors in UI
  setError,
}) {
  const { result: resultRaw } = conversionResult;

  const [resultTab, setResultTab] = useState(initialTab);
  const [svg, setSvg] = useState();
  const [svgId, setSvgId] = useState();

  // Params of the created uml, used to create the embed link
  const umlParams = paramsFromStateUML({
    ...InitialUML,
    activeSource: API.sources.byText,
    textArea: resultRaw,
  });

  useEffect(scrollToResults, []);

  if (conversionResult)
    return (
      <div id={API.resultsId}>
        <Tabs activeKey={resultTab} onSelect={setResultTab} id="resultTabs">
          <Tab
            eventKey={API.tabs.visualization}
            title={API.texts.resultTabs.graph3d}
          >
            <ShowVisualization
              data={resultRaw}
              type={visualizationTypes.threeD}
              // No embed link for 3D for now
            />
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
