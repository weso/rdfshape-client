import React from 'react';
import { Permalink}  from '../Permalink'

function ResultEndpointInfo(props) {
    return (
       <div style={{width: '100%'}}>
           <Permalink url={props.permalink} />
           { props.error? <p>{props.error}</p> : null }
           { props.result ?
              <details><summary>Endpoint response</summary><p>{JSON.stringify(props.result)}</p></details> : null }
       </div>
    )
}

export default ResultEndpointInfo;
