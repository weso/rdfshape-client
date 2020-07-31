import React, {Fragment} from 'react';
import Code from '../components/Code'
import Alert from "react-bootstrap/Alert";
import PrintJson from "../utils/PrintJson";
import {Permalink} from "../Permalink";

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
           { props.permalink &&
             <Fragment>
               <Permalink url={props.permalink}/>
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
