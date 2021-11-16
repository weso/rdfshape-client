import React from "react";
import API from "../API";
import SelectSHACLEngine from "../components/SelectSHACLEngine";
import SelectInferenceEngine from "../data/SelectInferenceEngine";
import SHACLTabs from "./SHACLTabs";

export const InitialShacl = {
  activeSource: API.sources.default,
  textArea: "",
  url: "",
  file: null,
  format: API.formats.defaultShacl,
  engine: API.engines.defaultShacl,
  inference: API.inferences.none,
  fromParams: false,
  codeMirror: null,
};

export function updateStateShacl(params, shacl) {
  if (params["schema"]) {
    const userSchema = params["schema"];
    const schemaSource = params["schemaSource"] || API.sources.default;

    return {
      ...shacl,
      activeSource: schemaSource,
      textArea:
        schemaSource == API.sources.byText ? userSchema : shacl.textArea,
      url: schemaSource == API.sources.byUrl ? userSchema : shacl.url,
      file: schemaSource == API.sources.byFile ? userSchema : shacl.file,
      fromParams: true,
      format: params["schemaFormat"] || shacl.format,
      engine: params["schemaEngine"] || shacl.engine,
      inference: params["schemaInference"] || shacl.inference,
    };
  }
  return shacl;
}

export function shaclParamsFromQueryParams(params) {
  let newParams = {};
  if (params.schema) newParams["schema"] = params.schema;
  if (params.schemaFormat) newParams["schemaFormat"] = params.schemaFormat;
  if (params.schemaEngine) newParams["schemaEngine"] = params.schemaEngine;
  if (params.schemaInference)
    newParams["schemaInference"] = params.schemaInference;
  return newParams;
}

export function paramsFromStateShacl(shacl) {
  let params = {};
  params["schemaSource"] = shacl.activeSource;
  params["schemaFormat"] = shacl.format;
  params["schemaEngine"] = shacl.engine;
  params["schemaInference"] = shacl.inference;

  switch (shacl.activeSource) {
    case API.sources.byText:
      params["schema"] = shacl.textArea.trim();
      break;
    case API.sources.byUrl:
      params["schema"] = shacl.url.trim();
      break;
    case API.sources.byFile:
      params["schema"] = shacl.file;
      break;
    default:
  }
  return params;
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
  if (shacl.activeSource === API.sources.byText) {
    return encodeURI(shacl.textArea.trim());
  } else if (shacl.activeSource === API.sources.byUrl) {
    return encodeURI(shacl.url.trim());
  }
  return "";
}
