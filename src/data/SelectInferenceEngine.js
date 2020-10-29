import PropTypes from "prop-types";
import React from "react";
import API from "../API";
import SelectFormat from "../components/SelectFormat";

function SelectInferenceEngine(props) {
  return (
    <SelectFormat
      handleFormatChange={props.handleInferenceChange}
      selectedFormat={props.selectedInference}
      urlFormats={API.inferenceEngines}
      name={props.name}
    />
  );
}

SelectInferenceEngine.propTypes = {
  handleInferenceChange: PropTypes.func.isRequired,
  selectedInference: PropTypes.string.isRequired,
  resetFromParams: PropTypes.func,
  fromParams: PropTypes.bool,
};

SelectInferenceEngine.defaultProps = {
  name: "Inference",
};

export default SelectInferenceEngine;
