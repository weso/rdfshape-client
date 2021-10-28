import React, { Fragment } from "react";
import Alert from "react-bootstrap/Alert";
import API from "../API";
import Code from "../components/Code";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";

function ResultDataExtract({
  result: extractResponse,
  fromParams,
  resetFromParams,
  permalink,
  disabled,
}) {
  // De-structure the API response for later usage
  const {
    message,
    data: inputData,
    schemaFormat: resultSchemaFormat,
    schemaEngine: resultSchemaEngine,
    result: { schema: resultSchema, shapeMap: resultShapeMap },
  } = extractResponse;
  let msg;
  if (extractResponse) {
    return (
      <div>
        {/* Alert */}
        <Alert variant="success">{message}</Alert>
        {/* Output schema */}
        {resultSchema && (
          <Code
            value={resultSchema}
            mode={resultSchemaFormat.name} // Presumably "ShExC"
            readOnly={true}
            fromParams={fromParams}
            resetFromParams={resetFromParams}
            linenumbers={true}
            // theme="material"
          />
        )}
        <br />
        {/* Full response */}
        <details>
          <summary>{API.responseSummaryText}</summary>
          <PrintJson json={extractResponse} />
        </details>
        {/* Permalink */}
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

export default ResultDataExtract;
