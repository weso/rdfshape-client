import React, { Fragment } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Alert from "react-bootstrap/Alert";
import API from "../API";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import { prefixMapTableColumns } from "../utils/Utils";

// Results of querying the API for information about a schema (either ShEx or SHACL)
function ResultSchemaInfo({ result: shexInfoResponse, permalink, disabled }) {
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
          <li>
            {API.texts.numberOfShapes}: {shapes.length}
          </li>
          <li>
            {API.texts.schemaFormat}: <span className="code">{formatName}</span>
          </li>
          <li>
            {API.texts.schemaEngine}: <span className="code">{engine}</span>
          </li>
          {prefixMap?.length > 0 ? (
            <li className="list-details">
              <details>
                <summary>Prefix map</summary>
                {/* Table with prefix map */}
                <div className="prefixMapTable">
                  <BootstrapTable
                    classes="results-table"
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
            <hr />
            <Permalink url={permalink} disabled={disabled} />
          </Fragment>
        )}
      </div>
    );
  }
}

ResultSchemaInfo.defaultProps = {
  disabled: false,
};

export default ResultSchemaInfo;
