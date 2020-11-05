import PropTypes from "prop-types";
import React from "react";
import Alert from "react-bootstrap/Alert";
import PrintJson from "../utils/PrintJson";
import PrintSVG from "../utils/PrintSVG";

function ResultShExVisualize(props) {
  const result = props.result;

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
    if (props.showDetails === true) {
      msg = (
        <details>
          <PrintJson json={result} />
        </details>
      );
    } else if (props.showDetails === false) {
      msg = (
        <div style={{ zoom: props.zoom }}>
          <PrintSVG svg={props.result.svg} />
        </div>
      );
    } else {
      msg = (
        <>
          <div style={{ zoom: props.zoom }}>
            <PrintSVG svg={props.result.svg} />
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
