import PropTypes from "prop-types";
import React from "react";
import API from "../API";
import environmentConfiguration from "../EnvironmentConfig";

// Aux component for showing server errors given the requested URL and message
function ResponseError({ errorOrigin, errorMessage }) {
  return (
    <details>
      <summary>
        {`${API.texts.errorResponsePrefix} from ${errorOrigin}`}{" "}
      </summary>
      {errorMessage && (
        <>
          <hr />
          <p className="code alert-body">{errorMessage}</p>
        </>
      )}
    </details>
  );
}

ResponseError.propTypes = {
  errorOrigin: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
};

export default ResponseError;

// Aux function to build a ResponseError item from an axios error and the URL the error comes from
export const mkError = (error, url = environmentConfiguration.apiHost) => {
  // Parse the server response for a custom error message, else use axios error message
  const errorMessage =
    error?.response?.data?.error ||
    error?.response?.data ||
    error?.message ||
    error ||
    API.texts.networkError;
  return (
    <ResponseError errorOrigin={url} errorMessage={errorMessage.toString()} />
  );
};
