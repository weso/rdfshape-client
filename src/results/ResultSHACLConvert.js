import React, { Fragment } from 'react';
import Alert from "react-bootstrap/Alert";
import Code from '../components/Code';
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import { mkMode } from "../utils/Utils";


function ResultSHACLConvert(props) {
  const result = props.result
  const mode = mkMode(result.targetSchemaFormat)
  let msg ;
  if (result === "") {
        msg = null
  }
  else if (result.error || result.msg.toLowerCase().startsWith("error")) {
    msg =
      <div>
        <Alert variant="danger">Invalid SHACL schema</Alert>
        <ul>
          <li className="word-break">{result.error || result.msg}</li>
        </ul>
      </div>
    }
  else {
    msg = <div>
      <Alert variant="success">{result.msg}</Alert>
         {result.result && (
         <Code
           value={result.result}
           mode={mode}
           theme="material"
         />)}
        {
          props.permalink &&
          <Fragment>
            <Permalink url={props.permalink} disabled={props.disabled}/>
            <hr/>
          </Fragment>
        }
       <details><PrintJson json={result}/></details>
    </div>
 }

 return (
   <div>{msg}</div>
  )
}

export default ResultSHACLConvert;
