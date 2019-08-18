import React from 'react';
import Cyto from "./Cyto";
import Container from "react-bootstrap/Container";

function mkSVG(svg) {
 return {__html: svg};
}

class ResultDataVisualization extends React.Component {

 render() {
     const result = this.props.result
     console.log("ResultDataVisualization" + JSON.stringify(result));
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
         const target = result.targetDataFormat.toLowerCase()
     if (target==="svg" || target ==="png") {
             msg = <div dangerouslySetInnerHTML={mkSVG(result.result)} />
     } else
     if (target === "json") {
         const elements = JSON.parse(result.result);
         console.log("Elements: ");
         console.log(elements);
         msg = <div>
             <Cyto elements={elements} />
             <details><pre>{JSON.stringify(result)}</pre></details>
         </div>
     } else
      {
             msg = <div>
                 <p>{result.msg}</p>
                 <details><pre>{JSON.stringify(result)}</pre></details>
             </div>
         }
     }

     return (
         <div>
             {msg}
         </div>
     );
 }
}

export default ResultDataVisualization;
