import PropTypes from "prop-types";
import React from "react";
import Alert from "react-bootstrap/Alert";
import PrintJson from "../utils/PrintJson";
import PrintSVG from "../utils/PrintSVG";

function ResultShExVisualize({ result, zoom, showDetails }) {
  let msg;
  if (result === "") {
    msg = null;
  } else if (result.error) {
    msg = (
      <div>
        <Alert variant="danger">Invalid ShEx schema</Alert>
        <ul>
          <li className="word-break">{result.error}</li>
        </ul>
      </div>
    );
  } else {
    if (showDetails === true) {
      msg = (
        <details>
          <PrintJson json={result} />
        </details>
      );
    } else if (showDetails === false) {
      msg = (
        <div style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}>
          <PrintSVG svg={result.svg} />
        </div>
      );
    } else {
      msg = (
        <>
          <div style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}>
            <PrintSVG svg={result.svg} />
          </div>
          <details>
            <PrintJson json={result} />
          </details>
        </>
      );
    }
  }

  return <div>{msg}</div>;
}

ResultShExVisualize.propTypes = {
  result: PropTypes.object,
  zoom: PropTypes.number,
  showDetails: PropTypes.bool,
};

export default ResultShExVisualize;
