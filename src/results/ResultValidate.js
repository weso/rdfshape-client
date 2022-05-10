import React, { Fragment, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import API from "../API";
import { Permalink } from "../Permalink";
import ShowShapeMap from "../shapeMap/ShowShapeMap";
import PrintJson from "../utils/PrintJson";
import { equalsIgnoreCase, scrollToResults } from "../utils/Utils";

export const conformant = "conformant"; // Status of conformant nodes
export const nonConformant = "nonconformant"; // Status of non-conformant nodes

function ResultSchemaValidate({
  result: schemaValidateResponse, // Request successful response
  permalink,
  disabled,
}) {
  const { message, data, schema, trigger, result } = schemaValidateResponse;

  // Store the resulting nodes in state, plus the invalid ones
  const [nodes] = useState(result.shapeMap);
  const [invalidNodes, setInvalidNodes] = useState([]);

  // Update invalid nodes on node changes
  useEffect(() => {
    const nonConformantNodes = nodes.filter((node) =>
      equalsIgnoreCase(node.status, nonConformant)
    );
    setInvalidNodes(nonConformantNodes);
  }, [nodes]);

  useEffect(scrollToResults, []);

  if (schemaValidateResponse) {
    return (
      <div id={API.resultsId}>
        {/* Place an alert depending on the validation errors */}
        {!nodes?.length ? ( // No results but the server returns a successful code
          <Alert variant="warning">{API.texts.validationResults.noData}</Alert>
        ) : invalidNodes.length == 0 ? ( // No invalid nodes among the results
          <Alert variant="success">
            {API.texts.validationResults.allValid}
          </Alert>
        ) : invalidNodes.length == nodes.length ? ( // All invalid nodes
          <Alert variant="danger">
            {API.texts.validationResults.noneValid}
          </Alert>
        ) : (
          // Some invalid nodes
          <Alert variant="warning">
            {API.texts.validationResults.someValid}
          </Alert>
        )}

        {nodes?.length && (
          <ShowShapeMap results={[result]} options={{ isStreaming: false }} />
        )}

        <details>
          <summary>{API.texts.responseSummaryText}</summary>
          <PrintJson json={schemaValidateResponse} />
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

export default ResultSchemaValidate;
