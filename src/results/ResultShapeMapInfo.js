import React, { Fragment } from "react";
import Alert from "react-bootstrap/Alert";
import API from "../API";
import Code from "../components/Code";
import { Permalink } from "../Permalink";
import { format2mode } from "../utils/Utils";

function ResultShapeMapInfo(props) {
  const successMessage = "Well formed ShapeMap";
  const result = props.result;
  let msg = null;
  if (result) {
    const mode = format2mode(result.shapeMapFormat);
    if (result.error) {
      msg = <Alert variant="danger">{result.error}</Alert>;
    } else {
      msg = (
        <div>
          <Alert variant="success">{successMessage}</Alert>
          {result.shapeMap && result.shapeMapFormat && (
            <Code
              value={result.shapeMap}
              mode={mode}
              readOnly={true}
              onChange={() => {}}
              fromParams={props.fromParams}
              resetFromParams={props.resetFromParams}
            />
          )}
          {props.permalink && (
            <Fragment>
              <hr />
              <Permalink url={props.permalink} disabled={props.disabled} />
            </Fragment>
          )}
          <details>
            <summary>{API.texts.responseSummaryText}</summary>
            <pre>{JSON.stringify(result)}</pre>
          </details>
        </div>
      );
    }
    return <div>{msg}</div>;
  } else
    return (
      <div>
        <Alert variant="danger">ShapeMap by URL/File not implemented</Alert>
      </div>
    );
}

export default ResultShapeMapInfo;
