import React from "react";
import API from "../API";
import ShExTabs from "./ShExTabs";

export const InitialShEx = {
  activeSource: API.sources.default,
  textArea: "",
  url: "",
  file: null,
  format: API.formats.defaultShex,
  engine: API.engines.defaultShex,
  fromParams: false,
  codeMirror: null,
};

export function updateStateShEx(params, shex) {
  // Only update state if there is shex
  if (params["schema"]) {
    // Get the raw data string introduced by the user
    const userSchema = params["schema"];
    // Get the schema source to be used: take it from params or resort to default
    const schemaSource = params["schemaSource"] || API.sources.default;

    // Compose new Schema State building from the old one
    return {
      ...shex,
      activeSource: schemaSource,
      // Fill in the data containers with the user data if necessary. Else leave them as they were.
      textArea: schemaSource == API.sources.byText ? userSchema : shex.textArea,
      url: schemaSource == API.sources.byUrl ? userSchema : shex.url,
      file: schemaSource == API.sources.byFile ? userSchema : shex.file,
      fromParams: true,
      format: params["schemaFormat"] || shex.format,
      // Get the schema engine or leave it as is
      engine: params["schemaEngine"] || shex.engine,
    };
  }
  return shex;
}

export function shExParamsFromQueryParams(params) {
  let newParams = {};
  if (params.schema) newParams["schema"] = params.schema;
  if (params.schemaSource) newParams["schemaSource"] = params.schemaSource;
  if (params.schemaFormat) newParams["schemaFormat"] = params.schemaFormat;
  if (params.schemaEngine) newParams["schemaEngine"] = params.schemaEngine;
  return newParams;
}

export function paramsFromStateShEx(shex) {
  let params = {};
  params["schemaSource"] = shex.activeSource;
  params["schemaFormat"] = shex.format;
  params["schemaEngine"] = shex.engine;

  // Send the "schema" param to the server, that will use the "schemaSource" to know hot to treat the schema (raw, URL, file...)
  switch (shex.activeSource) {
    case API.sources.byText:
      params["schema"] = shex.textArea.trim();
      break;
    case API.sources.byUrl:
      params["schema"] = shex.url.trim();
      break;
    case API.sources.byFile:
      params["schema"] = shex.file;
      break;
  }
  return params;
}

export function getShexText(shex) {
  if (shex.activeSource === API.sources.byText) {
    return encodeURI(shex.textArea.trim());
  } else if (shex.activeSource === API.sources.byUrl) {
    return encodeURI(shex.url.trim());
  }
  return "";
}

export function mkShExTabs(shex, setShEx, name, subname) {
  function handleShExTabChange(value) {
    setShEx({ ...shex, activeSource: value });
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

  function handleShExFormatChange(value) {
    setShEx({ ...shex, format: value });
  }

  console.log("MK: ", shex.activeSource);

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
