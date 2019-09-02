import React from 'react';
import { Permalink}  from '../Permalink'

function ResultEndpointInfo(props) {
    return (
       <div>
           { props.error? <p>{props.error}</p> : null }
           { props.result ?
              <details><pre>{JSON.stringify(props.result)}</pre></details> : null }
           <Permalink url={props.permalink} />
       </div>
    )
}

export default ResultEndpointInfo;
