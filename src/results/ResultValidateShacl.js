import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import API from "../API";
import Code from "../components/Code";
import { Permalink } from "../Permalink";
import ShowShapeMap from "../shapeMap/ShowShapeMap";
import PrintJson from "../utils/PrintJson";
import { equalsIgnoreCase, format2mode, scrollToResults } from "../utils/Utils";
import { nonConformant } from "./ResultValidate";

function ResultValidateShacl({
  result: schemaValidateResponse,
  permalink,
  disabled,
  initialTab,
}) {
  const {
    message,
    data,
    schema: { engine: schemaEngine }, // Relevant: using SHACLex yields enhanced results
    trigger,
    result: {
      message: resultMessage,
      valid: resultValid,
      errors: resultErrors,
      validationReport,
      shapeMap: resultsMap,
      nodesPrefixMap,
      shapesPrefixMap,
    },
  } = schemaValidateResponse;

  // Results active tab
  const [activeTab, setActiveTab] = useState(initialTab);

  // Store the resulting nodes in state, plus the invalid ones
  const [nodes] = useState(resultsMap);
  const [invalidNodes, setInvalidNodes] = useState([]);

  // Update invalid nodes on node changes
  useEffect(() => {
    const nonConformantNodes = nodes.filter((node) =>
      equalsIgnoreCase(node.status, nonConformant)
    );
    setInvalidNodes(nonConformantNodes);
  }, [nodes]);

  useEffect(scrollToResults, []);

  if (schemaValidateResponse)
    return (
      <div id={API.resultsId}>
        {/* Place an alert depending on the validation errors and engine used */}

        {schemaEngine === API.engines.shaclex ? (
          // Used SHACLex: we can tell how many nodes were conformant
          !nodes?.length ? ( // No results but the server returns a successful code
            <Alert variant="warning">
              {API.texts.validationResults.noData}
            </Alert>
          ) : invalidNodes.length == 0 ? ( // No invalid nodes among the results
            <Alert variant="success">
              {API.texts.validationResults.allValid}
            </Alert>
          ) : invalidNodes.length == nodes.length ? ( // All invalid nodes
            <Alert variant="danger">
              {API.texts.validationResults.noneValid}
            </Alert>
          ) : (
            // Some invalid nodes
            <Alert variant="warning">
              {API.texts.validationResults.someValid}
            </Alert>
          )
        ) : // Did not use SHACLex: we can only tell if the whole data was valid or not
        resultValid ? (
          <Alert variant="success">
            {API.texts.validationResults.allValid}
          </Alert>
        ) : (
          <Alert variant="danger">
            {`${API.texts.validationResults.noneValid}. ${resultMessage}`}
          </Alert>
        )}

        <Fragment>
          <Tabs
            activeKey={activeTab}
            id="resultTabs"
            onSelect={(e) => setActiveTab(e)}
          >
            <Tab
              eventKey={API.tabs.shaclValidationReportText}
              title={API.texts.misc.shaclValidationReportText}
            >
              <Code
                mode={format2mode(API.formats.turtle)}
                value={validationReport}
                readonly={true}
              />
            </Tab>
            {/* Detailed results tab only for SHACLex */}
            {schemaEngine === API.engines.shaclex && (
              <Tab
                eventKey={API.tabs.visualization}
                title={API.texts.misc.shaclValidationReportNodes}
              >
                {nodes?.length && (
                  <div style={{ marginTop: "5px" }}>
                    <ShowShapeMap
                      shapeMap={resultsMap}
                      nodesPrefixMap={nodesPrefixMap}
                      shapesPrefixMap={shapesPrefixMap}
                    />
                  </div>
                )}
              </Tab>
            )}
          </Tabs>
        </Fragment>

        <details>
          <summary>{API.texts.responseSummaryText}</summary>
          <PrintJson json={schemaValidateResponse} />
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

ResultValidateShacl.propTypes = {
  result: PropTypes.object,
  permalink: PropTypes.string,
  disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  initialTab: PropTypes.string,
};

ResultValidateShacl.defaultProps = {
  initialTab: API.tabs.shaclValidationReportText, // Key of the initially active tab
};

export default ResultValidateShacl;
