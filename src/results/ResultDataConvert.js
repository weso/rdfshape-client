import React, { Fragment } from "react";
import Alert from "react-bootstrap/Alert";
import Code from "../components/Code";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import { format2mode } from "../utils/Utils";

function ResultDataConvert({
  result,
  permalink,
  fromParams,
  resetFromParams,
  disabled,
}) {
  let msg;
  if (result === "") {
    msg = null;
  } else if (result.error) {
    msg = <Alert variant="danger">{result.error}</Alert>;
  } else {
    msg = (
      <div>
        <Alert variant="success">{result.message}</Alert>
        {result.result && result.dataFormat && (
          <Code
            value={result.result}
            readOnly={true}
            mode={format2mode(result.targetDataFormat)}
            fromParams={fromParams}
            resetFromParams={resetFromParams}
          />
        )}

        <details>
          <PrintJson json={result} />
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

  return <div>{msg}</div>;
}

export default ResultDataConvert;
