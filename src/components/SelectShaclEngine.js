import PropTypes from "prop-types";
import React from "react";
import API from "../API";
import SelectFormat from "./SelectFormat";

function SelectSHACLEngine(props) {
  return (
    <SelectFormat
      name={props.name}
      urlFormats={props.urlEngines}
      selectedFormat={props.selectedEngine}
      handleFormatChange={props.handleEngineChange}
      fromParams={props.fromParams}
      resetFromParams={props.resetFromParams}
      extraOptions={props.extraOptions}
    />
  );
}

SelectSHACLEngine.propTypes = {
  urlEngines: PropTypes.string,
  handleEngineChange: PropTypes.func.isRequired,
  selectedEngine: PropTypes.string.isRequired,
  resetFromParams: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  fromParams: PropTypes.bool,
  extraOptions: PropTypes.array,
};

SelectSHACLEngine.defaultProps = {
  name: API.texts.selectors.shaclEngine,
  urlEngines: API.routes.server.schemaShaclEngines,
  resetFromParams: false,
  extraOptions: [],
};

export default SelectSHACLEngine;
