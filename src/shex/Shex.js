import React from "react";
import API from "../API";
import ShexTabs from "./ShexTabs";

export const InitialShex = {
  activeSource: API.sources.default,
  textArea: "",
  url: "",
  file: null,
  format: API.formats.defaultShex,
  engine: API.engines.defaultShex,
  fromParams: false,
  codeMirror: null,
};

export function updateStateShex(params, shex) {
  // Only update state if there is shex
  if (params[API.queryParameters.schema.schema]) {
    // Get the raw data string introduced by the user
    const userSchema = params[API.queryParameters.schema.schema];
    // Get the schema source to be used: take it from params or resort to default
    const schemaSource =
      params[API.queryParameters.schema.source] || API.sources.default;

    // Compose new Schema State building from the old one
    return {
      ...shex,
      activeSource: schemaSource,
      // Fill in the data containers with the user data if necessary. Else leave them as they were.
      textArea: schemaSource == API.sources.byText ? userSchema : shex.textArea,
      url: schemaSource == API.sources.byUrl ? userSchema : shex.url,
      file: schemaSource == API.sources.byFile ? userSchema : shex.file,
      fromParams: true,
      format: params[API.queryParameters.schema.format] || shex.format,
      // Get the schema engine or leave it as is
      engine: params[API.queryParameters.schema.engine] || shex.engine,
    };
  }
  return shex;
}

export function paramsFromStateShex(shex) {
  let params = {};
  params[API.queryParameters.schema.source] = shex.activeSource;
  params[API.queryParameters.schema.format] = shex.format;
  params[API.queryParameters.schema.engine] = shex.engine;

  // Send the "schema" param to the server, that will use the "schemaSource" to know hot to treat the schema (raw, URL, file...)
  switch (shex.activeSource) {
    case API.sources.byText:
      params[API.queryParameters.schema.schema] = shex.textArea.trim();
      break;
    case API.sources.byUrl:
      params[API.queryParameters.schema.schema] = shex.url.trim();
      break;
    case API.sources.byFile:
      params[API.queryParameters.schema.schema] = shex.file;
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

export function mkShexTabs(shex, setShex, name, subname) {
  function handleShexTabChange(value) {
    setShex({ ...shex, activeSource: value });
  }

  function handleShexByTextChange(value) {
    setShex({ ...shex, textArea: value });
  }

  function handleShexUrlChange(value) {
    setShex({ ...shex, url: value });
  }

  function handleShexFileUpload(value) {
    setShex({ ...shex, file: value });
  }

  function handleShexFormatChange(value) {
    setShex({ ...shex, format: value });
  }

  return (
    <ShexTabs
      name={name}
      subname={subname}
      activeSource={shex.activeSource}
      handleTabChange={handleShexTabChange}
      textAreaValue={shex.textArea}
      handleByTextChange={handleShexByTextChange}
      urlValue={shex.url}
      handleShExUrlChange={handleShexUrlChange}
      handleFileUpload={handleShexFileUpload}
      selectedFormat={shex.format}
      handleShExFormatChange={handleShexFormatChange}
      setCodeMirror={(cm) => setShex({ ...shex, codeMirror: cm })}
      fromParams={shex.fromParams}
      resetFromParams={() => setShex({ ...shex, fromParams: false })}
    />
  );
}
