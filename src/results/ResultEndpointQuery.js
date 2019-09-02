import React from 'react';
import ResultQuery from "./ResultQuery"
import {Permalink} from '../Permalink'

function ResultEndpointInfo(props) {
    return (
        <div>
        {props.error ? <p>{props.error}</p> : null}
        {props.result ? <div>
                <ResultQuery result={props.result}/>
        </div> : null
        }
            <Permalink url={props.permalink}/>
        </div>
    )
}

export default ResultEndpointInfo;
