import React from 'react';

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
         } else {
             msg = <div>
                 <p>{result.msg}</p>
                 <ul>
                     <li>Number of statements: {result.numberStatements}</li>
                     <li>Data: <pre>{result.data}</pre></li>
                     <li>DataFormat: <span>{result.dataFormat}</span></li>
                 </ul>
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
