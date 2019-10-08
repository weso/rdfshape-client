import React from 'react';
import Code from '../Code'
import { Permalink } from "../Permalink"
import { mkMode } from "../Utils"


function ResultShExConvert(props) {
  const result = props.result
  const mode = mkMode(result.targetSchemaFormat)
  console.log(`ResultShExConvert:`);
  console.log(result);
  console.log(`Mode: ${mode}`)
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
         {result.result && (
         <Code
           value={result.result}
           mode={mode}
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

export default ResultShExConvert;
