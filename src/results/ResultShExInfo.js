import React, {Fragment} from 'react'
import PropTypes from "prop-types"
import PrintJson from "../utils/PrintJson"
import Alert from 'react-bootstrap/Alert'
import {Permalink} from "../Permalink"
import {error} from "cytoscape/src/util";

function ResultShExInfo(props) {

  const result = props.result
  let msg
  if (result === "") {
    msg = null
  } else
  if (!result.wellFormed) {
    msg =
      <div>
        <Alert variant="danger">{result.errors && "Invalid ShEx schema" }</Alert>
        <ul>
          {result.errors.map( error => <li>{error}</li>)}
        </ul>
      </div>
  } else {

    msg =
        <div>
          <Alert variant="success">Well formed schema</Alert>
          {
            props.permalink &&
            <Fragment>
              <Permalink url={props.permalink}/>
              <hr/>
            </Fragment>
          }
          <details>
            <PrintJson json={result} />
          </details>
        </div>
  }

  return (
    <div>{msg}</div>
  );

}

ResultShExInfo.propTypes = {
    result: PropTypes.object
}

export default ResultShExInfo
