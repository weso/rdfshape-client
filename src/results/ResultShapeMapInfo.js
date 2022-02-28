import React, { Fragment, useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import API from "../API";
import { Permalink } from "../Permalink";
import { associationTableColumns, scrollToResults } from "../utils/Utils";

function ResultShapeMapInfo({
  result: shapeMapInfoResult,
  permalink,
  disabled,
}) {
  const {
    message,
    shapeMap: { shapeMap: inputShapeMap, model: shapeMapModel },
    result: {
      numberOfAssociations,
      format: { name: shapeMapFormatName },
      nodesPrefixMap, // Arrays
      shapesPrefixMap,
    },
  } = shapeMapInfoResult;

  // Active tab control
  const [resultTab, setResultTab] = useState(API.tabs.overview);

  useEffect(scrollToResults, []);

  if (shapeMapInfoResult) {
    return (
      <div id={API.resultsId}>
        <Tabs activeKey={resultTab} id="resultTabs" onSelect={setResultTab}>
          {/* ShapeMap Overview */}
          <Tab
            eventKey={API.tabs.overview}
            title={API.texts.resultTabs.overview}
          >
            <div className="marginTop">
              <ul>
                <li>{message}</li>
                <li>
                  {API.texts.numberOfAssociations}: {numberOfAssociations}
                </li>
                <li>
                  {API.texts.shapeMapFormat}:{" "}
                  <span className="code">{shapeMapFormatName}</span>
                </li>
              </ul>
            </div>
          </Tab>
          {/* ShapeMap Associations */}
          <Tab
            eventKey={API.tabs.associations}
            title={API.texts.resultTabs.associations}
          >
            <div className="marginTop">
              {shapeMapModel?.length > 0 ? (
                <div className="prefixMapTable">
                  <BootstrapTable
                    keyField="node"
                    data={shapeMapModel}
                    columns={associationTableColumns}
                  ></BootstrapTable>
                </div>
              ) : (
                <ul>
                  <li>{API.texts.noAssociations}</li>
                </ul>
              )}
            </div>
          </Tab>
        </Tabs>

        <br />

        <details>
          <summary>{API.texts.responseSummaryText}</summary>
          <pre>{JSON.stringify(shapeMapInfoResult)}</pre>
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
export default ResultShapeMapInfo;
