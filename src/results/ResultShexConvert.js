import React, { Fragment } from "react";
import Alert from "react-bootstrap/Alert";
import API from "../API";
import Code from "../components/Code";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import { format2mode } from "../utils/Utils";

function ResultShExConvert({
  result: shexConvertResponse,
  permalink,
  disabled,
}) {
  // Destructure request response items for later usage
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
  } = shexConvertResponse;

  if (shexConvertResponse) {
    return (
      <div>
        {/* Alert */}
        <Alert variant="success">{message}</Alert>
        {/* Output schema */}
        {outputSchema && outputFormatName && (
          // TODO: output schema should be in Yashe too
          <Code
            value={outputSchema}
            mode={format2mode(outputFormatName)}
            readOnly={true}
          />
        )}
        <br />
        <details>
          <summary>{API.texts.operationInformation}</summary>
          <ul>
            <li>{`Engine conversion: ${inputEngine} => ${outputEngine}`}</li>
            <li>{`Format conversion: ${inputFormatName} => ${outputFormatName}`}</li>
          </ul>
        </details>
        <details>
          <summary>{API.texts.responseSummaryText}</summary>
          <PrintJson json={shexConvertResponse} />
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

export default ResultShExConvert;
