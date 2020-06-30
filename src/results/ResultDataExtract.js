import React from 'react';
import Code from '../components/Code'
import Alert from "react-bootstrap/Alert";

function ResultDataExtract(props) {
     const result = props.result
     let msg;
     if (result === "") {
         msg = null
     } else
     if (result.error) {
         msg =
             <div>
                 <Alert variant="danger">Error: {result.error}</Alert>
             </div>
     } else {
         msg = <div>
             <p>{result.msg}</p>
             {result.inferedShape && (
                 <Code
                     value={result.inferedShape}
                     mode="ShExC"
                     readOnly={true}
                     fromParams={props.fromParams}
                     resetFromParams={props.resetFromParams}
                     linenumbers={true}
                     theme="material"
                 />
             )}
         </div>
     }

     return (
         <div>
             {msg}
             { !result.error ? result && <details><pre>{JSON.stringify(result)}</pre></details> : null }
         </div>
     );
}

export default ResultDataExtract;
