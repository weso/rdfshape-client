import React, {useEffect} from 'react';
import ResultQuery from "./ResultQuery";
import {Permalink} from '../Permalink';
import Alert from "react-bootstrap/Alert";

function ResultEndpointInfo(props) {
    return (
        <div style={{width: '100%'}}>
            <Permalink url={props.permalink} />
            { props.error? <p>{props.error}</p> : null }
        {props.result ? <div>
                <ResultQuery result={props.result}/>
        </div> : null
        }
        </div>
    )
}

export default ResultEndpointInfo;
