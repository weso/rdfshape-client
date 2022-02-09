import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import API from "../API";
import Code from "../components/Code";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import { scrollToResults } from "../utils/Utils";
import ShowVisualization, {
  visualizationTypes
} from "../visualization/ShowVisualization";

function ResultDataExtract({
  result: { extractResponse, visualizeResponse },
  permalink,
  disabled,
}) {
  // De-structure the API response for later usage
  const {
    schemaFormat: resultSchemaFormat,
    result: { schema: resultSchema },
  } = extractResponse;

  const {
    result: { schema: schemaSvg },
  } = visualizeResponse;

  // State to control the selected tab
  const [resultTab, setResultTab] = useState(API.tabs.shex);

  useEffect(scrollToResults, []);

  if (extractResponse) {
    return (
      <div id={API.resultsId}>
        <Tabs activeKey={resultTab} id="resultTabs" onSelect={setResultTab}>
          {/* Schema text result */}
          {resultSchema && (
            <Tab
              eventKey={API.tabs.shex}
              title={API.texts.resultTabs.extracted}
            >
              <Code
                value={resultSchema}
                mode={resultSchemaFormat.name} // Presumably "ShExC"
                readOnly={true}
                linenumbers={true}
              />
            </Tab>
          )}
          {/* Schema visual result */}
          {visualizeResponse && (
            <Tab
              eventKey={API.tabs.visualization}
              title={API.texts.resultTabs.visualization}
            >
              <ShowVisualization
                data={schemaSvg}
                type={visualizationTypes.svgRaw}
                raw={false}
                controls={true}
                embedLink={false}
                disabledLinks={disabled}
              />
            </Tab>
          )}
        </Tabs>

        <hr />
        {/* Full response */}
        <details>
          <summary>{API.texts.responseSummaryText}</summary>
          <PrintJson
            json={{
              extraction: extractResponse,
              visualization: visualizeResponse,
            }}
          />
        </details>
        {/* Permalink */}
        {permalink && (
          <Fragment>
            <Permalink url={permalink} disabled={disabled} />
          </Fragment>
        )}
      </div>
    );
  }
}

ResultDataExtract.propTypes = {
  permalink: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.bool,
};

export default ResultDataExtract;
