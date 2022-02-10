import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import API from "../API";
import ByText from "../components/ByText";
import { mkEmbedLink, Permalink } from "../Permalink";
import { InitialShex, paramsFromStateShex } from "../shex/Shex";
import PrintJson from "../utils/PrintJson";
import { scrollToResults, yasheResultButtonsOptions } from "../utils/Utils";
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

  // Params of the extracted schema, used to create the embed link
  const schemaParams = paramsFromStateShex({
    ...InitialShex,
    activeSource: API.sources.byText,
    textArea: resultSchema,
    format: resultSchemaFormat.name,
    engine: API.engines.shex,
  });

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
              <ByText
                textAreaValue={resultSchema}
                textFormat={resultSchemaFormat.name} // Presumably "ShExC"
                readOnly={true}
                options={{ ...yasheResultButtonsOptions }}
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
                embedLink={mkEmbedLink(schemaParams, {
                  visualizationType:
                    API.queryParameters.visualization.types.shex,
                  visualizationTarget:
                    API.queryParameters.visualization.targets.svg,
                })}
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
