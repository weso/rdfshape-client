import React, { Fragment, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import API from "../API";
import ByText from "../components/ByText";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import { yasheNoButtonsOptions } from "../utils/Utils";

function ResultSchemaConvert({
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

  const [resultTab, setResultTab] = useState(API.tabs.result);

  if (shexConvertResponse) {
    return (
      <div id="results-container">
        <Tabs activeKey={resultTab} onSelect={setResultTab} id="resultTabs">
          {/* Output schema */}
          {outputSchema && outputFormatName && (
            <Tab eventKey={API.tabs.result} title={API.texts.resultTabs.result}>
              <ByText
                textAreaValue={outputSchema}
                textFormat={outputFormatName}
                fromParams={false}
                options={{ ...yasheNoButtonsOptions }}
              />
            </Tab>
          )}
        </Tabs>

        <hr />

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
            <Permalink url={permalink} disabled={disabled} />
          </Fragment>
        )}
      </div>
    );
  }
}

export default ResultSchemaConvert;
