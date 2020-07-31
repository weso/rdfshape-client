import React, {Fragment} from 'react'
import PropTypes from "prop-types"
import PrintJson from "../utils/PrintJson"
import Code from "../components/Code"
import {Permalink} from "../Permalink"
import Alert from "react-bootstrap/Alert";

function ResultShEx2Shacl(props) {
  const result = props.result
  let msg

  if (result === "") {
    msg = null
  }
  else if (result.error || result.msg.toLowerCase().includes("error")) {
    msg =
      <div>
        <Alert variant="danger">Invalid ShEx schema</Alert>
        <ul>
          <li className="word-break">{result.error || result.msg}</li>
        </ul>
      </div>
  }
  else {
    msg =
    <div>
      <Alert variant="success">Conversion successful</Alert>
      { result.result && <Code value={result.result} mode={props.mode}/> }
      <details><PrintJson json={result} /></details>
      { props.permalink &&
      <Fragment>
        <hr/>
        <Permalink url={props.permalink}/>
      </Fragment>
      }
    </div>
  }

  return (
    <div>{msg}</div>
  )
}

ResultShEx2Shacl.propTypes = {
  result: PropTypes.object,
  mode: PropTypes.string
}

export default ResultShEx2Shacl
