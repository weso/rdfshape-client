import React from 'react';
import ResultQuery from "./ResultQuery";
import {Permalink} from '../Permalink';
import Alert from "react-bootstrap/Alert";

function ResultEndpointInfo(props) {
    return (
        <div>
        {props.error ? <Alert variant='danger'>{props.error}</Alert> : null}
        {props.result ? <div>
                <ResultQuery result={props.result}/>
        </div> : null
        }
        </div>
    )
}

export default ResultEndpointInfo;
