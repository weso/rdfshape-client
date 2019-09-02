import React from 'react';
import Alert from "react-bootstrap/Alert";
import ShowShapeMap from "../ShowShapeMap";

class ResultValidate extends React.Component {
 render() {
     const result = this.props.result
     console.log("ResultQuery" + JSON.stringify(result));
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
             { result.message && <Alert variant="success">{result.msg} </Alert> }
             { result.error && <Alert variant="danger">{result.error}</Alert> }
             { result.shapeMap && <ShowShapeMap
                 shapeMap={result.shapeMap}
                 nodesPrefixMap={result.nodesPrefixMap}
                 shapesPrefixMap={result.shapesPrefixMap}
             /> }
             <details><pre>{JSON.stringify(result)}</pre></details>
         </div>
     }

     return (
         <div>
             {msg}
         </div>
     );
 }
}

export default ResultValidate;
