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
    />
  );
}

SelectSHACLEngine.propTypes = {
  urlEngines: PropTypes.string,
  handleEngineChange: PropTypes.func.isRequired,
  selectedEngine: PropTypes.string.isRequired,
  resetFromParams: PropTypes.func,
  fromParams: PropTypes.bool,
};

SelectSHACLEngine.defaultProps = {
  name: "SHACL engine",
  urlEngines: API.routes.server.schemaShaclEngines,
};

export default SelectSHACLEngine;
