import React, { Fragment, useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import API from "../API";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import { prefixMapTableColumns, scrollToResults } from "../utils/Utils";
import ShowVisualization, {
  visualizationTypes
} from "../visualization/ShowVisualization";

// Compendium of data overview, prefix map and visualizations
function ResultDataInfo({
  result: { resultInfo, resultDot, resultCyto }, // Request successful response
  permalink,
  disabled,
}) {
  // Active tab control
  const [resultTab, setResultTab] = useState(API.tabs.overview);
  const [visualTab, setVisualTab] = useState(API.tabs.visualizationDot);

  // Destructure response items for later usage
  const {
    message: messageInfo,
    result: {
      numberOfStatements,
      prefixMap,
      format: { name: formatName },
    },
  } = resultInfo;

  const { visualization: dotVisualization } = resultDot;
  const { elements: cytoElements } = resultCyto;

  const [cytoVisual, setCytoVisual] = useState(null);

  useEffect(scrollToResults, []);

  // Forcibly render the cyto when entering the tab for accurate dimensions
  function renderCytoVisual() {
    setCytoVisual(
      <ShowVisualization
        data={{ elements: cytoElements }}
        type={visualizationTypes.cytoscape}
        raw={false}
        controls={true}
        embedLink={false} // TODO
        disabledLinks={false} // TODO
      />
    );
  }

  if (resultInfo) {
    return (
      <>
        <div id={API.resultsId}>
          <Tabs activeKey={resultTab} id="resultTabs" onSelect={setResultTab}>
            {/* Data overview */}
            <Tab
              eventKey={API.tabs.overview}
              title={API.texts.resultTabs.overview}
            >
              <div className="marginTop">
                <ul>
                  <li>{messageInfo}</li>
                  <li>
                    {API.texts.numberOfStatements}: {numberOfStatements}
                  </li>
                  <li>
                    {API.texts.dataFormat}:{" "}
                    <span className="code">{formatName}</span>
                  </li>
                </ul>
              </div>
            </Tab>

            {/* Data prefix map */}
            {prefixMap && (
              <Tab
                eventKey={API.tabs.prefixMap}
                title={API.texts.resultTabs.prefixMap}
              >
                <div className="prefixMapTable marginTop">
                  <BootstrapTable
                    keyField="prefixName"
                    data={prefixMap}
                    columns={prefixMapTableColumns}
                    noDataIndication={API.texts.noPrefixes}
                  ></BootstrapTable>
                </div>
              </Tab>
            )}

            {/* Data visualizations */}
            <Tab
              eventKey={API.tabs.visualizations}
              title={API.texts.resultTabs.visualizations}
            >
              {(resultCyto || resultDot) && (
                <Tabs
                  activeKey={visualTab}
                  id="visualTabs"
                  onSelect={setVisualTab}
                >
                  {resultDot && (
                    <Tab
                      eventKey={API.tabs.visualizationDot}
                      title={API.texts.resultTabs.visualizationDot}
                    >
                      <ShowVisualization
                        data={dotVisualization.data}
                        type={visualizationTypes.svgObject}
                        raw={false}
                        controls={true}
                        embedLink={false} // TODO
                        disabledLinks={false} // TODO
                      />
                    </Tab>
                  )}
                  {resultCyto && (
                    <Tab
                      eventKey={API.tabs.visualizationCyto}
                      title={API.texts.resultTabs.visualizationCyto}
                      onEnter={renderCytoVisual}
                    >
                      {cytoVisual}
                    </Tab>
                  )}
                </Tabs>
              )}
            </Tab>
          </Tabs>
        </div>

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
      </>
    );
  }
}

ResultDataInfo.defaultProps = {
  disabled: false,
};

export default ResultDataInfo;
