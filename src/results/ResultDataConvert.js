import React from 'react';
import Code from '../components/Code'
import { Permalink } from "../Permalink"
import { mkMode } from "../utils/Utils"


function ResultDataConvert(props) {
  const result = props.result
  let msg ;
  if (result === "") {
        msg = null
  } 
  else if (result.error) {
    msg = <div><p>Error: {result.error}</p>
            <details><pre>{JSON.stringify(result)}</pre></details>
           </div>
    } 
  else {
    msg = <div>
      <p>{result.msg}</p>
         {result.result && result.dataFormat && (
         <Code
           value={result.result}
           readOnly
           mode={mkMode(result.dataFormat)}
           theme="material"
         />)}
       <details><pre>{JSON.stringify(result)}</pre></details>
       <Permalink url={props.permalink} />
    </div>
 }

 return (
   <div>{msg}</div>
  );
}

export default ResultDataConvert;
