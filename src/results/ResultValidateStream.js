import PropTypes from "prop-types";
import React, { Fragment, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import API from "../API";
import { Permalink } from "../Permalink";
import ShowShapeMap from "../shapeMap/ShowShapeMap";
import PrintJson from "../utils/PrintJson";
import { mkError } from "../utils/ResponseError";
import { scrollToResults } from "../utils/Utils";

export const conformant = "conformant"; // Status of conformant nodes
export const nonConformant = "nonconformant"; // Status of non-conformant nodes

function ResultValidateStream({
  results,
  error,
  config,
  // Info about the paused status of the validation
  paused,
  setPaused,
  permalink,
  disabled,
}) {
  // Max number of items passed down to UI, no more than N elements will appear on the UI
  const maxItemsUI = 100;

  // Check if validator halts on invalid to know how to format some results
  const haltOnInvalid =
    config?.[API.queryParameters.streaming.configuration]?.[
      API.queryParameters.streaming.validator.validator
    ]?.[API.queryParameters.streaming.validator.haltOnInvalid];

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

  useEffect(scrollToResults, []);

  // Factory of HTML spinners sharing the same properties unless overridden by user
  const mkSpinner = (options) => (
    <Spinner
      className="white-filler"
      {...{ animation: "grow", size: "sm", ...options }}
    />
  );

  // Factory of Alerts showing the validation status
  const mkAlert = (
    text,
    options = {
      variant: "success",
      spinner: false,
    }
  ) => (
    <Alert {...{ variant: "success", ...{ variant: options.variant } }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {text}
        {options.spinner && mkSpinner()}
      </div>
    </Alert>
  );

  return (
    <div id={API.resultsId}>
      <div>
        {/* Alert shows status (even when there are errors, show old results) */}
        {error ? ( // An error occurred
          <Alert variant="danger">
            {mkError(error, API.routes.server.schemaValidateStream)}
          </Alert>
        ) : results.length ? (
          // There are results, validation is running (either playing or paused)
          paused ? (
            mkAlert(API.texts.streamingTexts.validationPaused, {
              variant: "info",
              spinner: false,
            })
          ) : (
            mkAlert(API.texts.streamingTexts.validationRunning, {
              variant: "success",
              spinner: true,
            })
          )
        ) : (
          // No results but no errors, validation is starting
          mkAlert(API.texts.streamingTexts.validationStarting, {
            variant: "info",
            spinner: true,
          })
        )}

        {/* Render the results table */}
        {results.length > 0 && (
          <ShowShapeMap
            results={results.map(formatResult).slice(0, maxItemsUI)}
            options={{ isStreaming: true, isPaused: paused, setPaused }}
          />
        )}

        {/* Show server config details */}
        {config && (
          <details>
            <summary>
              {API.texts.streamingTexts.validationConfiguration}
            </summary>
            <PrintJson json={config} />
          </details>
        )}

        {/* Permalink */}
        {permalink && (
          <Fragment>
            <hr />
            <Permalink url={permalink} disabled={disabled} />
          </Fragment>
        )}
      </div>
    </div>
  );
}

ResultValidateStream.propTypes = {
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
  disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

ResultValidateStream.defaultProps = {
  stopValidation: () => {},
  resumeValidation: () => {},
  permalink: false,
  disabled: false,
};

export default ResultValidateStream;
