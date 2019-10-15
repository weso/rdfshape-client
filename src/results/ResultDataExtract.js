import React from 'react';
import Code from '../Code'
import { mkMode } from "../Utils"

function ResultDataExtract(props) {
     const result = props.result
     let msg ;
     if (result === "") {
         msg = null
     } else
     if (result.error) {
         msg =
             <div><p>Error: {result.error}</p>
                </div>
     } else {
         msg = <div>
             <p>{result.msg}</p>
             {result.inferedShape && (
                 <Code
                     value={result.inferedShape}
                     mode="ShExC"
                     readonly={true}
                     linenumbers={true}
                     theme="material"
                 />
             )}
         </div>
     }

     return (
         <div>
             {msg}
             { result && <details><pre>{JSON.stringify(result)}</pre></details> }
         </div>
     );
}

export default ResultDataExtract;
