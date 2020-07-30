import React from 'react';
import ResultQuery from "./ResultQuery";
import {Permalink} from '../Permalink';

function ResultEndpointInfo(props) {
    return (
        <div className="width-100">
            <Permalink url={props.permalink} />
            { props.error && <p>Failed to resolve query ({props.error}). Check input data or try again later.</p> }
        {props.result && <div>
                <ResultQuery result={props.result}/>
        </div>
        }
        </div>
    )
}

export default ResultEndpointInfo;
