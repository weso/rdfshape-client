import React, {Fragment} from 'react';
import ResultQuery from "./ResultQuery";
import {Permalink} from '../Permalink';

function ResultEndpointInfo(props) {
    return (
        <div className="width-100">
          {props.permalink &&
              <Fragment>
                <hr/>
                <Permalink url={props.permalink}/>
              </Fragment>
          }
          { props.error && <p>Failed to resolve query ({props.error}). Check input data or try again later.</p> }
          {props.result &&
          <div>
                <ResultQuery result={props.result}/>
          </div>
        }
        </div>
    )
}

export default ResultEndpointInfo;
