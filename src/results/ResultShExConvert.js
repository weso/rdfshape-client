import React, { Fragment } from "react";
import Alert from "react-bootstrap/Alert";
import API from "../API";
import Code from "../components/Code";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import { mkMode } from "../utils/Utils";

function ResultShExConvert(props) {
  const result = props.result;
  const mode = mkMode(result.targetSchemaFormat);
  let msg;
  if (result === "") {
    msg = null;
  } else if (result.error || result.message.toLowerCase().startsWith("error")) {
    msg = (
      <div>
        <Alert variant="danger">Invalid ShEx schema</Alert>
        <ul>
          <li className="word-break">{result.error || result.message}</li>
        </ul>
      </div>
    );
  } else {
    msg = (
      <div>
        <Alert variant="success">{result.message}</Alert>
        {result.result && (
          <Code value={result.result} mode={mode} theme="material" />
        )}
        {props.permalink && (
          <Fragment>
            <Permalink url={props.permalink} disabled={props.disabled} />
            <hr />
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

export default ResultShExConvert;
