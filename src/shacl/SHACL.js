import React from "react";
import API from "../API";
import SelectSHACLEngine from "../components/SelectSHACLEngine";
import SelectInferenceEngine from "../data/SelectInferenceEngine";
import { convertSourceSchema, convertTabSchema } from "../shex/ShEx";
import SHACLTabs from "./SHACLTabs";

export const InitialShacl = {
  activeSource: API.defaultSource,
  textArea: "",
  url: "",
  file: null,
  format: API.defaultSHACLFormat,
  engine: API.defaultSHACLEngine,
  fromParams: false,
  codeMirror: null,
  inference: "none",
};

export function updateStateShacl(params, shacl) {
  if (params["schema"]) {
    return {
      ...shacl,
      activeSource: API.byTextSource,
      textArea: params["schema"],
      fromParams: true,
      format: params["schemaFormat"] ? params["schemaFormat"] : shacl.format,
      engine: params["schemaEngine"] ? params["schemaEngine"] : shacl.engine,
      inference: params["schemaInference"]
        ? params["schemaInference"]
        : shacl.inference,
    };
  }
  if (params["schemaUrl"]) {
    return {
      ...shacl,
      activeSource: API.byUrlSource,
      url: params["schemaUrl"],
      fromParams: false,
      format: params["schemaFormat"] ? params["schemaFormat"] : shacl.format,
      engine: params["schemaEngine"] ? params["schemaEngine"] : shacl.engine,
      inference: params["schemaInference"]
        ? params["schemaInference"]
        : shacl.inference,
    };
  }
  if (params["schemaFile"]) {
    return {
      ...shacl,
      activeSource: API.byFileSource,
      file: params["schemaFile"],
      fromParams: false,
      format: params["schemaFormat"] ? params["schemaFormat"] : shacl.format,
      engine: params["schemaEngine"] ? params["schemaEngine"] : shacl.engine,
      inference: params["schemaInference"]
        ? params["schemaInference"]
        : shacl.inference,
    };
  }
  return shacl;
}

export function paramsFromStateShacl(state) {
  const activeSource = state.activeSource;
  const textArea = state.textArea;
  const format = state.format;
  const url = state.url;
  const file = state.file;
  const engine = state.engine;
  const inference = state.inference;
  let params = {};
  params["activeSchemaSource"] = convertSourceSchema(activeSource);
  params["schemaFormat"] = format;
  params["schemaEngine"] = engine;
  params["schemaInference"] = inference;
  switch (activeSource) {
    case API.byTextSource:
      params["schema"] = textArea.trim();
      break;
    case API.byUrlSource:
      params["schemaUrl"] = url.trim();
      break;
    case API.byFileSource:
      params["schemaFile"] = file;
      break;
    default:
  }
  return params;
}

export function shaclParamsFromQueryParams(params) {
  let newParams = {};
  if (params.schema) newParams["schema"] = params.schema;
  if (params.schemaFormat) newParams["schemaFormat"] = params.schemaFormat;
  if (params.schemaUrl) newParams["schemaUrl"] = params.schemaUrl;
  if (params.schemaEngine) newParams["schemaEngine"] = params.schemaEngine;
  if (params.schemaInference)
    newParams["schemaInference"] = params.schemaInference;
  if (params.schemaFile) newParams["schemaFile"] = params.schemaFile;
  return newParams;
}

export function mkShaclTabs(shacl, setShacl, name, subname) {
  function handleShaclTabChange(value) {
    setShacl({ ...shacl, activeSource: value });
  }
  function handleShaclFormatChange(value) {
    setShacl({ ...shacl, format: value });
  }
  function handleShaclByTextChange(value) {
    setShacl({ ...shacl, textArea: value });
  }
  function handleShaclUrlChange(value) {
    setShacl({ ...shacl, url: value });
  }
  function handleShaclFileUpload(value) {
    setShacl({ ...shacl, file: value });
  }
  function handleInferenceChange(value) {
    setShacl({ ...shacl, inference: value });
  }

  function handleSHACLEngineChange(value) {
    setShacl({ ...shacl, engine: value });
  }
  const resetParams = () => setShacl({ ...shacl, fromParams: false });

  return (
    <React.Fragment>
      <SHACLTabs
        name={name}
        subname={subname}
        activeSource={shacl.activeSource}
        handleTabChange={handleShaclTabChange}
        textAreaValue={shacl.textArea}
        handleByTextChange={handleShaclByTextChange}
        urlValue={shacl.url}
        handleDataUrlChange={handleShaclUrlChange}
        handleFileUpload={handleShaclFileUpload}
        selectedFormat={shacl.format}
        handleDataFormatChange={handleShaclFormatChange}
        setCodeMirror={(cm) => setShacl({ ...shacl, codeMirror: cm })}
        fromParams={shacl.fromParams}
        resetFromParams={resetParams}
      />
      <SelectSHACLEngine
        handleSHACLEngineChange={handleSHACLEngineChange}
        selectedSHACLEngine={shacl.engine}
        fromParams={shacl.fromParams}
        resetFromParams={resetParams}
      />

      <SelectInferenceEngine
        handleInferenceChange={handleInferenceChange}
        selectedInference={shacl.inference}
        fromParams={shacl.fromParams}
        resetFromParams={resetParams}
      />
    </React.Fragment>
  );
}

export function getShaclText(shacl) {
  if (shacl.activeSource === API.byTextSource) {
    return encodeURI(shacl.textArea.trim());
  } else if (shacl.activeSource === API.byUrlSource) {
    return encodeURI(shacl.url.trim());
  }
  return "";
}
