import React, {Fragment} from 'react';
import Code from '../components/Code'
import { Permalink } from "../Permalink"
import {format2mode} from "../utils/Utils"
import Alert from "react-bootstrap/Alert";
import PrintJson from "../utils/PrintJson";


function ResultDataConvert(props) {
  const result = props.result
  let msg ;
  if (result === "") {
        msg = null
  }
  else if (result.error) {
    msg = <Alert variant='danger'>{result.error}</Alert>
    }
  else {
    msg = <div>
      <Alert variant='success'>{result.msg}</Alert>
         {result.result && result.dataFormat && (
         <Code
           value={result.result}
           readOnly
           mode={format2mode(result.targetDataFormat)}
           theme="light"
         />)}

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
  );
}

export default ResultDataConvert;
