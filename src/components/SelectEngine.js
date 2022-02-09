import PropTypes from "prop-types";
import React from "react";
import API from "../API";
import SelectFormat from "./SelectFormat";

export const allEngines = [
  API.engines.shex,
  API.engines.shaclex,
  API.engines.jenaShacl,
  API.engines.shacl_tq,

  API.engines.shumlex,
  API.engines.shapeForms,
];

export const schemaEngines = [
  API.engines.shex,
  API.engines.shaclex,
  API.engines.jenaShacl,
  API.engines.shacl_tq,
];

export const shaclEngines = [
  API.engines.shaclex,
  API.engines.jenaShacl,
  API.engines.shacl_tq,
];

export const extraEngine = [API.engines.shumlex, API.engines.shapeForms];

export function SelectEngine(props) {
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

SelectEngine.propTypes = {
  urlEngines: PropTypes.string,
  handleEngineChange: PropTypes.func.isRequired,
  selectedEngine: PropTypes.string.isRequired,
  resetFromParams: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  fromParams: PropTypes.bool,
  extraOptions: PropTypes.array,
};

SelectEngine.defaultProps = {
  name: API.texts.selectors.shaclEngine,
  resetFromParams: false,
  extraOptions: [],
};

// Shorthand for SelectEngine preconfigured with Shacl engines
export function SelectSHACLEngine(props) {
  return (
    <SelectEngine
      {...props}
      urlEngines={API.routes.server.schemaShaclEngines}
    />
  );
}

SelectSHACLEngine.defaultProps = {
  urlEngines: API.routes.server.schemaShaclEngines,
};
