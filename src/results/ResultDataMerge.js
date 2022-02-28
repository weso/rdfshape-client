import React, { Fragment, useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import API from "../API";
import ByText from "../components/ByText";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import {
  format2mode,
  scrollToResults,
  yasheResultButtonsOptions
} from "../utils/Utils";

// Similar to the results of data conversion, but with a previous merge operation
function ResultDataMerge({
  result: dataMergeResponse, // Request successful response
  permalink,
  fromParams,
  resetFromParams,
  disabled,
}) {
  // Destructure request response items for later usage
  const {
    message,
    data: inputDataItems, // Array of input data elements that were merged
    result: {
      content: dataRaw,
      format: { name: outputFormatName },
    },
  } = dataMergeResponse;

  const [resultTab, setResultTab] = useState(API.tabs.result);

  useEffect(scrollToResults, []);

  const mkInputFormats = () =>
    inputDataItems.reduce((acc, it, idx, arr) => {
      const inputFormat = it.format.name || "Unknown";

      acc += inputFormat;
      if (idx + 1 !== arr.length) acc += " / ";
      return acc;
    }, "");

  if (dataMergeResponse) {
    return (
      <div id={API.resultsId}>
        <Tabs activeKey={resultTab} onSelect={setResultTab} id="resultTabs">
          {/* Output data */}
          {dataRaw && outputFormatName && (
            <Tab eventKey={API.tabs.result} title={API.texts.resultTabs.result}>
              <ByText
                textAreaValue={dataRaw}
                textFormat={format2mode(outputFormatName)}
                fromParams={fromParams}
                readOnly={true}
                options={{ ...yasheResultButtonsOptions }}
              />
            </Tab>
          )}
        </Tabs>
        <br />
        <details>
          <summary>{API.texts.operationInformation}</summary>
          <ul>
            <li>
              Format conversion:{" "}
              <span className="code">{`${mkInputFormats()} => ${outputFormatName}`}</span>
            </li>
          </ul>
        </details>
        <details>
          <summary>{API.texts.responseSummaryText}</summary>
          <PrintJson json={dataMergeResponse} />
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

export default ResultDataMerge;
