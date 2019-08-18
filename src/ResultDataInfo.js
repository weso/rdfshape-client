import React from 'react';
import Code from './Code';
import { Permalink } from "./Permalink";
import { mkMode } from "./Utils";

class ResultDataInfo extends React.Component {
 constructor(props) {
      super(props);
      this.state = {result: this.props.result}
 }

 render() {
     const result = this.props.result
     console.log("ResultDataInfo ---> result: " + JSON.stringify(result));
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
         console.log("ResultDataInfo ---> dataFormat: " + JSON.stringify(result.dataFormat));
         msg = <div>
             <h2>{result.msg}</h2>
             {result.data && result.dataFormat && (
              <Code
                 value={result.data}
                 mode={mkMode(result.dataFormat)}
                 theme="material"
              />
             )}
             <ul>
                 <li>Number of statements: {result.numberStatements}</li>
                 <li>DataFormat: <span>{result.dataFormat}</span></li>
             </ul>
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


export default ResultDataInfo;
