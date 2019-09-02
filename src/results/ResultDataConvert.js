import React from 'react';
import Code from '../Code'
import { Permalink } from "../Permalink"
import { mkMode } from "../Utils"


class ResultDataConvert extends React.Component {
 render() {
     const result = this.props.result
     console.log("ResultDataConvert" + JSON.stringify(result));
     let msg ;
     if (result === "") {
         msg = null
     } else
     if (result.error) {
         msg =
             <div><p>Error: {result.error}</p>
                 <details><pre>{JSON.stringify(result)}</pre></details>
                </div>
     } else {
         msg = <div>
             <p>{result.msg}</p>
             {result.result && result.dataFormat && (
                 <Code
                     value={result.result}
                     mode={mkMode(result.dataFormat)}
                     theme="material"
                 />
             )}
             <details><pre>{JSON.stringify(result)}</pre></details>
             <Permalink url={this.props.permalink} />
         </div>
     }

     return (
         <div>
             {msg}
         </div>
     );
 }
}

export default ResultDataConvert;
