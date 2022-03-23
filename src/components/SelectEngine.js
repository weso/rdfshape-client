import PropTypes from "prop-types";
import React, { useContext, useEffect } from "react";
import API from "../API";
import { ApplicationContext } from "../context/ApplicationContext";
import SelectFormat from "./SelectFormat";

export const shaclEngines = [
  API.engines.shaclex,
  API.engines.jenaShacl,
  API.engines.shacl_tq,
];

// ShEx + SHACL Engines => All schema engines
export const schemaEngines = [API.engines.shex, ...shaclEngines];

export const extraEngines = [
  API.engines.shumlex,
  API.engines.shapeForms,
  // API.engines.tresdshex,
];

export const allEngines = [...schemaEngines, ...extraEngines];

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
  // Get schema and its setter from context
  const { shaclSchema: ctxShacl, setShaclSchema: setCtxShacl } = useContext(
    ApplicationContext
  );

  // Change context when the contained schema changes
  useEffect(() => {
    setCtxShacl(props.shacl);
  }, [props.shacl]);

  return (
    <SelectEngine
      {...props}
      selectedEngine={props.selectedEngine || ctxShacl.engine}
      urlEngines={API.routes.server.schemaShaclEngines}
    />
  );
}

SelectSHACLEngine.defaultProps = {
  urlEngines: API.routes.server.schemaShaclEngines,
};
