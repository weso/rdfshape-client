import React from 'react';
import ResultQuery from "./ResultQuery";
import {Permalink} from '../Permalink';

function ResultEndpointInfo(props) {
    return (
        <div className="width-100">
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
