import React, { Fragment } from "react";
import Alert from "react-bootstrap/Alert";
import API from "../API";
import { Permalink } from "../Permalink";
import ShowShapeMap from "../shapeMap/ShowShapeMap";
import PrintJson from "../utils/PrintJson";

const nonConformant = "nonconformant";

function ResultValidate(props) {
  const result = props.result;

  const getNonConformant = (nodes) => {
    if (!nodes) return [];
    else {
      const statuses = nodes.filter((node) => node.status === nonConformant);
      return statuses;
    }
  };

  let msg;
  if (result === "") {
    msg = null;
  } else if (result.error) {
    msg = (
      <div>
        <Alert variant="danger">Error: {result.error}</Alert>
      </div>
    );
  } else {
    msg = (
      <div>
        {!Array.isArray(result.shapeMap) ? (
          <Alert variant="danger">{result.message}</Alert>
        ) : (
          <Fragment>
            {result.errors.length > 0 ? (
              <Alert variant="danger">
                Partially invalid data: check the details of each node to learn
                more
              </Alert>
            ) : result.shapeMap.length === 0 ? (
              <Alert variant="warning">
                Validation was successful but no results were obtained, check if
                the input data is coherent
              </Alert>
            ) : getNonConformant(result.shapeMap).length > 0 ? (
              <Alert variant="warning">
                Partially invalid data: check the details of each node to learn
                more
              </Alert>
            ) : (
              result.message && (
                <Alert variant="success">{result.message} </Alert>
              )
            )}

            {props.permalink && (
              <Fragment>
                <Permalink url={props.permalink} disabled={props.disabled} />
                <hr />
              </Fragment>
            )}
            {result.shapeMap && result.shapeMap.length > 0 && (
              <ShowShapeMap
                shapeMap={result.shapeMap}
                nodesPrefixMap={result.nodesPrefixMap}
                shapesPrefixMap={result.shapesPrefixMap}
              />
            )}
          </Fragment>
        )}
        <details>
          <summary>{API.responseSummaryText}</summary>
          <PrintJson json={result} />
        </details>
      </div>
    );
  }

  return <div>{msg}</div>;
}

export default ResultValidate;
