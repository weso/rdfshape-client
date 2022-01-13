import React, { Fragment } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Alert from "react-bootstrap/Alert";
import API from "../API";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import { prefixMapTableColumns } from "../utils/Utils";

function ResultDataInfo({
  result: dataInfoResponse, // Request successful response
  permalink,
  disabled,
}) {
  // Destructure response items for later usage
  const {
    message,
    result: {
      numberOfStatements,
      prefixMap,
      format: { name: formatName },
    },
  } = dataInfoResponse;

  if (dataInfoResponse) {
    return (
      <div>
        <Alert variant="success">{message}</Alert>
        <ul>
          <li>{API.texts.numberOfStatements}: {numberOfStatements}</li>
          <li>
            {API.texts.dataFormat}: <span className="code">{formatName}</span>
          </li>
          {prefixMap?.length > 0 ? (
            <li className="list-details">
              <details>
                <summary>{API.texts.misc.prefixMap}</summary>
                {/* Table with prefix map */}
                <div className="prefixMapTable">
                  <BootstrapTable
                    keyField="prefixName"
                    data={prefixMap}
                    columns={prefixMapTableColumns}
                  ></BootstrapTable>
                </div>
              </details>
            </li>
          ) : (
            <li>{API.texts.noPrefixes}</li>
          )}
        </ul>
        <details>
          <summary>{API.texts.responseSummaryText}</summary>
          <PrintJson json={dataInfoResponse} />
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

ResultDataInfo.defaultProps = {
  disabled: false,
};

export default ResultDataInfo;
