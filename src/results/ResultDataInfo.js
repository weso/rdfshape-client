import React, { Fragment } from "react";
import Alert from "react-bootstrap/Alert";
import API from "../API";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import { mkMode } from "../utils/Utils";

function ResultDataInfo({
  result: dataInfoResponse, // Request successful response
  permalink,
  disabled,
}) {
  // Destructure request response items for later usage
  const {
    message,
    result: {
      numberOfStatements,
      format: { name: formatName },
    },
  } = dataInfoResponse;
  if (dataInfoResponse) {
    return (
      <div>
        <div>
          <Alert variant="success">{message}</Alert>
          <br />
          <ul>
            <li>Number of statements: {numberOfStatements}</li>
            <li>
              DataFormat: <span>{formatName}</span>
            </li>
          </ul>
          <details>
            <summary>{API.responseSummaryText}</summary>
            <PrintJson json={dataInfoResponse} />
          </details>
          {permalink && (
            <Fragment>
              <hr />
              <Permalink url={permalink} disabled={disabled} />
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}

ResultDataInfo.defaultProps = {
  disabled: false,
};

export default ResultDataInfo;
