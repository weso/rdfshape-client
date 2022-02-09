import React, { useEffect } from "react";
import API from "../API";
import { Permalink } from "../Permalink";
import { scrollToResults } from "../utils/Utils";

function ResultEndpointInfo(props) {

  useEffect(scrollToResults, []);

  return (
    <div id={API.resultsId} className="width-100">
      <Permalink url={props.permalink} disabled={props.disabled} />
      {props.error ? <p>{props.error}</p> : null}
      {props.result ? (
        <details>
          <summary>Endpoint response (raw)</summary>
          <p>{JSON.stringify(props.result)}</p>
        </details>
      ) : null}
    </div>
  );
}

export default ResultEndpointInfo;
