import React, { Fragment } from "react";
import Alert from "react-bootstrap/Alert";
import API from "../API";
import Code from "../components/Code";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import { format2mode } from "../utils/Utils";

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
      data: dataRaw,
      format: { name: outputFormatName },
    },
  } = dataMergeResponse;

  const mkInputFormats = () =>
    inputDataItems.reduce((acc, it, idx, arr) => {
      const inputFormat = it.format.name || "Unknown";

      acc += inputFormat;
      if (idx + 1 !== arr.length) acc += " / ";
      return acc;
    }, "");

  if (dataMergeResponse) {
    return (
      <div>
        {/* Alert */}
        <Alert variant="success">{message}</Alert>
        {/* Output data */}
        {dataRaw && outputFormatName && (
          <Code
            value={dataRaw}
            mode={format2mode(outputFormatName)}
            fromParams={fromParams}
            resetFromParams={resetFromParams}
            readOnly={true}
          />
        )}
        <br />
        <details>
          <summary>{API.texts.operationInformation}</summary>
          <ul>
            <li>{`Format conversion: ${mkInputFormats()} => ${outputFormatName}`}</li>
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
