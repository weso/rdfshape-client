import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import shumlex from "shumlex";
import API from "../API";
import { shaclEngines } from "../components/SelectEngine";
import { mkEmbedLink, Permalink } from "../Permalink";
import { shumlexCytoscapeStyle } from "../utils/cytoscape/cytoUtils";
import PrintJson from "../utils/PrintJson";
import { prefixMapTableColumns, scrollToResults } from "../utils/Utils";
import ShowVisualization, {
  visualizationTypes
} from "../visualization/ShowVisualization";

// Results of querying the API for information about a schema (either ShEx or SHACL)
function ResultSchemaInfo({
  result: { resultInfo, resultVisualize },
  params: stateSchemaParams,
  schemaEngine,
  permalink,
  disabled,
}) {
  // Destructure request response items for later use
  const {
    message: messageInfo,
    schema: { content: schemaRaw },
    result: {
      format: { name: formatName },
      engine,
      shapes,
      prefixMap,
    },
  } = resultInfo;

  const {
    result: { content: schemaSvg },
  } = resultVisualize;

  // Active tab control
  const [resultTab, setResultTab] = useState(API.tabs.overview);
  const [visualTab, setVisualTab] = useState(API.tabs.visualizationDot);

  const [cytoElements, setCytoElements] = useState([]);
  const [cytoVisual, setCytoVisual] = useState(null);
  const [threedVisual, setThreedVisual] = useState(null);

  const embedLinkType = shaclEngines.includes(schemaEngine)
    ? API.queryParameters.visualization.types.shacl
    : API.queryParameters.visualization.types.shex;

  useEffect(scrollToResults, []);

  useEffect(() => {
    // If using ShEx, to to create CytoVisual and 3D visual
    if (schemaEngine === API.engines.shex) {
      try {
        // We used shumlex to create CytoVisuals for ShEx
        // Does "crearGrafo" keep existing?
        setCytoElements(shumlex.crearGrafo(schemaRaw));
      } catch (err) {
        console.warn(err);
        setCytoElements([]);
      }
    }
  }, []);

  // Forcibly render the cyto when entering the tab for accurate dimensions
  function renderCytoVisual() {
    setCytoVisual(
      <ShowVisualization
        data={{
          elements: cytoElements,
          stylesheet: shumlexCytoscapeStyle,
        }}
        type={visualizationTypes.cytoscape}
        embedLink={mkEmbedLink(stateSchemaParams, {
          visualizationType: embedLinkType,
          visualizationTarget: API.queryParameters.visualization.targets.cyto,
        })}
      />
    );
  }

  // Forcibly render the 3D when entering the tab for accurate dimensions
  function render3DVisual() {
    setThreedVisual(
      <ShowVisualization
        data={schemaRaw}
        type={visualizationTypes.threeD}
        // No embed link for 3D for now
      />
    );
  }

  if (resultInfo) {
    return (
      <div id={API.resultsId}>
        <Tabs
          activeKey={resultTab}
          id="resultTabs"
          onSelect={setResultTab}
          mountOnEnter={true}
        >
          {/* Schema overview */}
          <Tab
            eventKey={API.tabs.overview}
            title={API.texts.resultTabs.overview}
          >
            <div className="marginTop">
              <ul>
                <li>{messageInfo}</li>
                <li>
                  {API.texts.numberOfShapes}: {shapes.length}
                </li>
                <li>
                  {API.texts.schemaFormat}:{" "}
                  <span className="code">{formatName}</span>
                </li>
                <li>
                  {API.texts.schemaEngine}:{" "}
                  <span className="code">{engine}</span>
                </li>
              </ul>
            </div>
          </Tab>
          {/* Schema prefix map */}
          {prefixMap && (
            <Tab
              eventKey={API.tabs.prefixMap}
              title={API.texts.resultTabs.prefixMap}
            >
              <div className="prefixMapTable marginTop">
                <BootstrapTable
                  classes="results-table"
                  keyField="prefixName"
                  data={prefixMap}
                  columns={prefixMapTableColumns}
                  noDataIndication={API.texts.noPrefixes}
                ></BootstrapTable>
              </div>
            </Tab>
          )}
          {/* Schema visualizations */}
          {resultVisualize && (
            <Tab
              eventKey={API.tabs.visualizations}
              title={API.texts.resultTabs.visualizations}
            >
              {(schemaSvg || cytoElements) && (
                <Tabs
                  activeKey={visualTab}
                  id="visualTabs"
                  onSelect={setVisualTab}
                  mountOnEnter={true}
                >
                  {/* SVG visualization */}
                  {schemaSvg && (
                    <Tab
                      eventKey={API.tabs.visualizationDot}
                      title={API.texts.resultTabs.visualizationDot}
                    >
                      <ShowVisualization
                        data={schemaSvg}
                        type={visualizationTypes.svgRaw}
                        embedLink={mkEmbedLink(stateSchemaParams, {
                          visualizationType: embedLinkType,
                          visualizationTarget:
                            API.queryParameters.visualization.targets.svg,
                        })}
                      />
                    </Tab>
                  )}
                  {/* Cytoscape visualization */}
                  {cytoElements?.length > 0 && (
                    <Tab
                      eventKey={API.tabs.visualizationCyto}
                      title={API.texts.resultTabs.visualizationCyto}
                      onEnter={renderCytoVisual}
                    >
                      {cytoVisual}
                    </Tab>
                  )}
                  {/* 3D visualization for ShEx */}
                  {schemaRaw && schemaEngine === API.engines.shex && (
                    <Tab
                      eventKey={API.tabs.visualization3d}
                      title={API.texts.resultTabs.graph3d}
                      onEnter={render3DVisual}
                    >
                      {threedVisual}
                    </Tab>
                  )}
                </Tabs>
              )}
            </Tab>
          )}
        </Tabs>

        <br />

        <details>
          <summary>{API.texts.responseSummaryText}</summary>
          <PrintJson json={resultInfo} />
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
}

ResultSchemaInfo.propTypes = {
  disabled: PropTypes.bool,
  schemaEngine: PropTypes.string.isRequired,
};

ResultSchemaInfo.defaultProps = {
  disabled: false,
};

export default ResultSchemaInfo;
