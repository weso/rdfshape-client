import React, { Fragment } from "react";
import Alert from "react-bootstrap/Alert";
import API from "../API";
import ByText from "../components/ByText";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import { yasheNoButtonsOptions } from "../utils/Utils";

function ResultSHACLConvert({ result: conversionResult, permalink, disabled }) {
  const {
    message,
    schema: {
      schema: inputSchema,
      format: { name: inputFormatName },
      engine: inputEngine,
    },
    result: {
      schema: outputSchema,
      format: { name: outputFormatName },
      engine: outputEngine,
    },
  } = conversionResult;

  if (conversionResult) {
    return (
      <div>
        {/* Alert */}
        <Alert variant="success">{message}</Alert>
        {/* Output schema */}
        {outputSchema && outputFormatName && (
          <ByText
            textAreaValue={outputSchema}
            textFormat={outputFormatName}
            fromParams={false}
            options={{ ...yasheNoButtonsOptions }}
          />
        )}

        <details>
          <summary>{API.texts.operationInformation}</summary>
          <ul>
            <li>{`Engine conversion: ${inputEngine} => ${outputEngine}`}</li>
            <li>{`Format conversion: ${inputFormatName} => ${outputFormatName}`}</li>
          </ul>
        </details>
        <details>
          <summary>{API.texts.responseSummaryText}</summary>
          <PrintJson json={conversionResult} />
        </details>
        {permalink && (
          <Fragment>
            <hr />
            <Permalink url={permalink} disabled={disabled} />
          </Fragment>
        )}
      </div>
    );
  }
}

export default ResultSHACLConvert;
