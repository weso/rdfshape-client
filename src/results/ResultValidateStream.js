import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import API from "../API";
import { Permalink } from "../Permalink";
import ShowShapeMap from "../shapeMap/ShowShapeMap";
import PrintJson from "../utils/PrintJson";
import { mkError } from "../utils/ResponseError";
import { scrollToResults, usePrevious } from "../utils/Utils";

export const valid = "valid"; // Status of valid validated data
export const invalid = "invalid"; // Status of invalid validated data
export const errored = "errored"; // Status of non-validated data (an errored occurred)

function ResultValidateStream({
  results,
  error,
  config,
  // Info about the paused status of the validation
  paused,
  setPaused,
  clearItems,
  permalink,
  disabled,
}) {
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

  // Max number of items passed down to UI, no more than N elements will appear on the UI
  const maxItemsUI = 100;

  // Check if validator halts on invalid to know how to format some results
  const haltOnInvalid =
    config?.[API.queryParameters.streaming.configuration]?.[
      API.queryParameters.streaming.validator.validator
    ]?.[API.queryParameters.streaming.validator.haltOnInvalid];

  // Incoming results, formatted to be passed down to UI rendered component
  const [formattedResults, setFormattedResults] = useState(
    results.map(formatResult)
  );

  // What was the state of the items before this render
  const prevResults = usePrevious(formattedResults);

  // Set to true the moment a result is received and shown
  const [hasStarted, setHasStarted] = useState(false);

  // Set them once, the moment the first result is received
  // Assume all data will share them
  const [nodesPrefixMap, setNodesPrefixMap] = useState(null);
  const [shapesPrefixMap, setShapesPrefixMap] = useState(null);

  // Update formatted results
  useEffect(() => {
    setFormattedResults(results.map(formatResult));
  }, [results]);

  // Update related state when results change
  useEffect(() => {
    // If there were items present before this change, then the validation had already started
    setHasStarted(prevResults?.length > 0);
    // Prefix maps: update if a result is available and they are still undefined
    if (formattedResults.length > 0 && (!nodesPrefixMap || !shapesPrefixMap)) {
      setNodesPrefixMap(formattedResults[0].nodesPrefixMap);
      setShapesPrefixMap(formattedResults[0].shapesPrefixMap);
    }
  }, [formattedResults]);

  useEffect(() => {
    // If the validation configuration changes, then it is a new validation:
    // It has not started at all
    setHasStarted(false);
    // New prefix maps, probably
    setNodesPrefixMap(null);
    setShapesPrefixMap(null);
    // Scroll to results table
    scrollToResults();
  }, [config]);

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

  const runningAlert = mkAlert(API.texts.streamingTexts.validationRunning, {
    variant: "success",
    spinner: true,
  });

  const pausedAlert = mkAlert(API.texts.streamingTexts.validationPaused, {
    variant: "info",
    spinner: false,
  });

  const startingAlert = mkAlert(API.texts.streamingTexts.validationStarting, {
    variant: "info",
    spinner: true,
  });

  return (
    <div id={API.resultsId}>
      <div>
        {/* Alert shows status (even when there are errors, show old results) */}
        {error ? ( // An error occurred
          <Alert variant="danger">
            {mkError(error, API.routes.server.schemaValidateStream)}
          </Alert>
        ) : formattedResults.length > 0 || hasStarted ? (
          // There are results, or at least the validation has started (might have been cleared)
          paused ? (
            pausedAlert
          ) : (
            runningAlert
          )
        ) : (
          startingAlert
        )}

        {/* Render the results table */}
        {(formattedResults.length > 0 ||
          (nodesPrefixMap && shapesPrefixMap)) && (
          <ShowShapeMap
            results={formattedResults.slice(0, maxItemsUI)}
            options={{
              isStreaming: true,
              isPaused: paused,
              setPaused,
              clearItems,
              nodesPrefixMap,
              shapesPrefixMap,
              error,
            }}
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
  paused: PropTypes.bool,
  setPaused: PropTypes.func,
  clearItems: PropTypes.func,
  // Other props
  permalink: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

ResultValidateStream.defaultProps = {
  paused: false,
  setPaused: () => {},
  clearItems: () => {},
  permalink: false,
  disabled: false,
};

export default ResultValidateStream;
