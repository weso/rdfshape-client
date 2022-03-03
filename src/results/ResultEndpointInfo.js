import React, { useEffect } from "react";
import { Alert } from "react-bootstrap";
import API from "../API";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import { scrollToResults } from "../utils/Utils";

function ResultEndpointInfo({
  result: endpointInfoResult,
  permalink,
  disabled,
}) {
  const { response, online } = endpointInfoResult;

  useEffect(scrollToResults, []);

  if (endpointInfoResult)
    return (
      <div id={API.resultsId} className="width-100">
        <Alert variant={online ? "success" : "warning"}>
          {online ? API.texts.endpoints.online : API.texts.endpoints.offline}
        </Alert>
        {permalink && (
          <>
            <hr />
            <Permalink url={permalink} disabled={disabled} />
          </>
        )}
        <details>
          <summary>{API.texts.responseSummaryText}</summary>
          <PrintJson
            json={endpointInfoResult}
            styles={{ whiteSpace: "pre-line" }}
          />
        </details>
      </div>
    );
}

export default ResultEndpointInfo;
