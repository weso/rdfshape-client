import React, {Fragment} from 'react';
import Code from '../components/Code';
import { mkMode } from "../utils/Utils";
import {Permalink} from "../Permalink";
import Alert from "react-bootstrap/Alert";
import PrintJson from "../utils/PrintJson";


function ResultShExConvert(props) {
  const result = props.result
  const mode = mkMode(result.targetSchemaFormat)
  let msg ;
  if (result === "") {
        msg = null
  }
  else if (result.error || result.msg.startsWith("Error")) {
    msg =
      <div>
        <Alert variant="danger">Invalid ShEx schema</Alert>
        <ul>
          <li className="word-break">{result.error || result.msg}</li>
        </ul>
      </div>
    }
  else {
    msg = <div>
      <p>{result.msg}</p>
         {result.result && (
         <Code
           value={result.result}
           mode={mode}
           theme="material"
         />)}
        {
          props.permalink &&
          <Fragment>
            <Permalink url={props.permalink}/>
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

export default ResultShExConvert;
