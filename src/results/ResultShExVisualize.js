import PropTypes from "prop-types";
import React, { Fragment } from 'react';
import Alert from "react-bootstrap/Alert";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import PrintSVG from "../utils/PrintSVG";

function ResultShExVisualize(props) {
  const result = props.result

  let msg
  if (result === "") {
    msg = null
  } else
  if (result.error) {
    msg =
      <div>
        <Alert variant="danger">Invalid ShEx schema</Alert>
        <ul>
          <li className="word-break">{result.error}</li>
        </ul>
      </div>

  } else {
    msg =
      <div>
        <PrintSVG svg={props.result.svg}/>
        {
          props.permalink &&
          <Fragment>
            <Permalink url={props.permalink} disabled={props.disabled}/>
            <hr/>
          </Fragment>
        }
        <details><PrintJson json={result} /></details>
      </div>
  }

  return (
    <div>{msg}</div>
  );

}

ResultShExVisualize.propTypes = {
    result: PropTypes.object,
};

export default ResultShExVisualize;
