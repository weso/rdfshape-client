import React, { Fragment } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Alert from "react-bootstrap/Alert";
import API from "../API";
import { Permalink } from "../Permalink";
import { associationTableColumns } from "../utils/Utils";

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

  if (shapeMapInfoResult) {
    return (
      <div>
        {/* Alert */}
        <Alert variant="success">{message}</Alert>
        {/* Results */}
        <ul>
          <li>
            {API.texts.numberOfAssociations}: {numberOfAssociations}
          </li>
          <li>
            {API.texts.shapeMapFormat}:{" "}
            <span className="code">{shapeMapFormatName}</span>
          </li>
          {shapeMapModel?.length > 0 ? (
            <li className="list-details">
              <details>
                <summary>{API.texts.misc.associations}</summary>
                {/* Table with prefix map */}
                <div className="prefixMapTable">
                  <BootstrapTable
                    keyField="node"
                    data={shapeMapModel}
                    columns={associationTableColumns}
                  ></BootstrapTable>
                </div>
              </details>
            </li>
          ) : (
            <li>{API.texts.noAssociations}</li>
          )}
        </ul>

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
