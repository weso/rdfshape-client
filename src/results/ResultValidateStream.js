import PropTypes from "prop-types";
import React, { Fragment } from "react";
import Alert from "react-bootstrap/Alert";
import API from "../API";
import { Permalink } from "../Permalink";
import ShowShapeMap from "../shapeMap/ShowShapeMap";
import PrintJson from "../utils/PrintJson";
import { mkError } from "../utils/ResponseError";

export const conformant = "conformant"; // Status of conformant nodes
export const nonConformant = "nonconformant"; // Status of non-conformant nodes

function ResultSchemaValidateStream({
  results,
  error,
  config,
  stopValidation,
  resumeValidation,
  permalink,
  disabled,
}) {
  // Max number of items passed down to UI, no more than N elements will appear on the UI
  const maxItemsUI = 100;

  // Check if validator halts on invalid to know how to format some results
  const haltOnInvalid =
    config[API.queryParameters.streaming.configuration][
      API.queryParameters.streaming.validator.validator
    ][API.queryParameters.streaming.validator.haltOnInvalid];

  // Format result objects as needed before sending them to the rendering component
  // Send the validation report + generated time
  const formatResult = (result) => {
    // Standard result, get report and date if possible
    if (!haltOnInvalid || result.valid)
      return {
        ...result.report,
        [API.queryParameters.streaming.date]:
          result[API.queryParameters.streaming.date],
      };
    // Stream will to halt on invalid: invalidating result, the report is contained in itself and there's no date
    else
      return {
        ...result,
      };
  };

  if (results) {
    // If there are results, render them
    return results.length ? (
      <div id={API.resultsId}>
        {/* Place an alert depending on the validation errors */}
        {error ? ( // An error occurred
          <Alert variant="danger">{mkError(error)}</Alert>
        ) : (
          // No error
          <Alert variant="success">Nothing to see here</Alert>
        )}

        {/* Render the results table */}
        {results.length && (
          <ShowShapeMap
            results={results.map(formatResult).slice(0, maxItemsUI)}
            options={{ isStreaming: true }}
          />
        )}

        {config && (
          <details>
            <summary>{API.texts.sentParams}</summary>
            <PrintJson json={config} />
          </details>
        )}

        {permalink && (
          <Fragment>
            <hr />
            <Permalink url={permalink} disabled={disabled} />
          </Fragment>
        )}
      </div>
    ) : (
      // No results, show informational message
      <p>Waiting for results...</p>
    );
  }
}

ResultSchemaValidateStream.propTypes = {
  // Set of results returned by the server, should update over time
  results: PropTypes.array.isRequired,
  // Error occurred during the streaming validation
  error: PropTypes.string,
  // JSON params that started the streaming validation
  config: PropTypes.object,
  // Functions to allow stop/resume of the same streaming validation
  stopValidation: PropTypes.func,
  resumeValidation: PropTypes.func,
  // Other props
  permalink: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.bool.isRequired,
};

ResultSchemaValidateStream.defaultProps = {
  stopValidation: () => {},
  resumeValidation: () => {},
  permalink: false,
  disabled: false,
};

export default ResultSchemaValidateStream;
