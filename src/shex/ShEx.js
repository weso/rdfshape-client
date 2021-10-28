import React from "react";
import API from "../API";
import ShExTabs from "./ShExTabs";

export const InitialShEx = {
  activeSource: API.defaultSource,
  textArea: "",
  url: "",
  file: null,
  format: API.defaultShExFormat,
  fromParams: false,
  codeMirror: null,
};

export function convertSourceSchema(key) {
  switch (key) {
    case API.byTextSource:
      return "#schemaTextArea";
    case API.byFileSource:
      return "#schemaFile";
    case API.byUrlSource:
      return "#schemaUrl";
    default:
      console.info(`Unknown schemaTab: ${key}`);
      return key;
  }
}

export function paramsFromStateShEx(state) {
  const activeSource = state.activeSource;
  const textArea = state.textArea;
  const format = state.format;
  const url = state.url;
  const file = state.file;
  let params = {};
  params["activeSchemaSource"] = convertSourceSchema(activeSource);
  params["schemaFormat"] = format;
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

export function updateStateShEx(params, shex) {
  if (params["schema"]) {
    return {
      ...shex,
      activeSource: API.byTextSource,
      textArea: params["schema"],
      fromParams: true,
      format: params["schemaFormat"] ? params["schemaFormat"] : shex.format,
    };
  }
  if (params["schemaUrl"]) {
    return {
      ...shex,
      activeSource: API.byUrlSource,
      url: params["schemaUrl"],
      fromParams: false,
      format: params["schemaFormat"] ? params["schemaFormat"] : shex.format,
    };
  }
  if (params["schemaFile"]) {
    return {
      ...shex,
      activeSource: API.byFileSource,
      file: params["schemaFile"],
      fromParams: false,
      format: params["schemaFormat"] ? params["schemaFormat"] : shex.format,
    };
  }
  return shex;
}

export function mkShExTabs(shex, setShEx, name, subname) {
  function handleShExTabChange(value) {
    setShEx({ ...shex, activeSource: value });
  }

  function handleShExFormatChange(value) {
    setShEx({ ...shex, format: value });
  }

  function handleShExByTextChange(value) {
    setShEx({ ...shex, textArea: value });
  }

  function handleShExUrlChange(value) {
    setShEx({ ...shex, url: value });
  }

  function handleShExFileUpload(value) {
    setShEx({ ...shex, file: value });
  }

  return (
    <ShExTabs
      name={name}
      subname={subname}
      activeSource={shex.activeSource}
      handleTabChange={handleShExTabChange}
      textAreaValue={shex.textArea}
      handleByTextChange={handleShExByTextChange}
      urlValue={shex.url}
      handleShExUrlChange={handleShExUrlChange}
      handleFileUpload={handleShExFileUpload}
      selectedFormat={shex.format}
      handleShExFormatChange={handleShExFormatChange}
      setCodeMirror={(cm) => setShEx({ ...shex, codeMirror: cm })}
      fromParams={shex.fromParams}
      resetFromParams={() => setShEx({ ...shex, fromParams: false })}
    />
  );
}

export function shExParamsFromQueryParams(params) {
  let newParams = {};
  if (params.schema) newParams["schema"] = params.schema;
  if (params.schemaFormat) newParams["schemaFormat"] = params.schemaFormat;
  if (params.schemaUrl) newParams["schemaUrl"] = params.schemaUrl;
  if (params.schemaFile) newParams["schemaFile"] = params.schemaFile;
  return newParams;
}

export function getShexText(shex) {
  if (shex.activeSource === API.byTextSource) {
    return encodeURI(shex.textArea.trim());
  } else if (shex.activeSource === API.byUrlSource) {
    return encodeURI(shex.url.trim());
  }
  return "";
}
