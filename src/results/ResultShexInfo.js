import PropTypes from "prop-types";
import React, { Fragment } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Alert from "react-bootstrap/Alert";
import API from "../API";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import { prefixMapTableColumns } from "../utils/Utils";

function ResultShExInfo({ result: shexInfoResponse, permalink, disabled }) {
  // Destructure request response items for later use
  const {
    message,
    schema,
    result: {
      format: { name: formatName },
      engine,
      shapes,
      prefixMap,
    },
  } = shexInfoResponse;

  if (shexInfoResponse) {
    return (
      <div>
        <Alert variant="success">{message}</Alert>
        <br />
        <ul>
          <li>Number of shapes: {shapes.length}</li>
          <li>
            Schema format: <span>{formatName}</span>
          </li>
          <li>
            Schema engine: <span>{engine}</span>
          </li>
          {prefixMap?.length > 0 ? (
            <li className="list-details">
              <details>
                <summary>Prefix map</summary>
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
          <PrintJson json={shexInfoResponse} />
        </details>
        {permalink && (
          <Fragment>
            <Permalink url={permalink} disabled={disabled} />
            <hr />
          </Fragment>
        )}
      </div>
    );
  }
}

ResultShExInfo.defaultProps = {
  disabled: false,
};

export default ResultShExInfo;
