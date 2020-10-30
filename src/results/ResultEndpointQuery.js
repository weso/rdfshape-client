import React, { Fragment } from 'react';
import { Permalink } from '../Permalink';
import ResultQuery from "./ResultQuery";

function ResultEndpointInfo(props) {
    return (
        <div className="width-100">
          {props.permalink &&
              <Fragment>
                <hr/>
                <Permalink url={props.permalink} disabled={props.disabled}/>
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
