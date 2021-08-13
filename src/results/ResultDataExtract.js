import React, { Fragment } from 'react';
import Alert from "react-bootstrap/Alert";
import Code from '../components/Code';
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";

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
             {result.inferredShape && (
                 <Code
                     value={result.inferredShape}
                     mode="ShExC"
                     readOnly={true}
                     fromParams={props.fromParams}
                     resetFromParams={props.resetFromParams}
                     linenumbers={true}
                     theme="material"
                 />
             )}
           { props.permalink &&
             <Fragment>
               <Permalink url={props.permalink} disabled={props.disabled}/>
               <hr/>
             </Fragment>
           }
         </div>
     }

     return (
         <div>
             {msg}
             { !result.error ? result && <details><PrintJson json={result} /></details> : null }
         </div>
     );
}

export default ResultDataExtract;
