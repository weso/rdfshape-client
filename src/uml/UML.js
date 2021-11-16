import React from "react";
import API from "../API";
import UMLTabs from "./UMLTabs";

export const InitialUML = {
  activeSource: API.defaultTab,
  textArea: "",
  url: "",
  file: null,
  format: API.formats.xml,
  fromParams: false,
  codeMirror: null,
};

export function convertTabSchema(key) {
  switch (key) {
    case API.sources.byText:
      return "#schemaTextArea";
    case API.sources.byFile:
      return "#schemaFile";
    case API.sources.byUrl:
      return "#schemaUrl";
    default:
      console.info("Unknown schemaTab: " + key);
      return key;
  }
}

export function paramsFromStateUML(state) {
  const activeSource = state.activeSource;
  const textArea = state.textArea;
  const format = state.format;
  const url = state.url;
  const file = state.file;
  let params = {};
  params["activeSchemaSource"] = convertTabSchema(activeSource);
  params["schemaFormat"] = format;
  switch (activeSource) {
    case API.sources.byText:
      params["schema"] = textArea;
      break;
    case API.sources.byUrl:
      params["schemaUrl"] = url;
      break;
    case API.sources.byFile:
      params["schemaFile"] = file;
      break;
    default:
  }
  return params;
}

export function updateStateUML(params, xmi) {
  if (params["schema"]) {
    return {
      ...xmi,
      activeSource: API.sources.byText,
      textArea: params["schema"],
      fromParams: true,
      format: params["schemaFormat"] ? params["schemaFormat"] : xmi.format,
    };
  }
  if (params["schemaUrl"]) {
    return {
      ...xmi,
      activeSource: API.sources.byUrl,
      url: params["schemaUrl"],
      fromParams: false,
      format: params["schemaFormat"] ? params["schemaFormat"] : xmi.format,
    };
  }
  if (params["schemaFile"]) {
    return {
      ...xmi,
      activeSource: API.sources.byFile,
      file: params["schemaFile"],
      fromParams: false,
      format: params["schemaFormat"] ? params["schemaFormat"] : xmi.format,
    };
  }
  return xmi;
}

export function mkUMLTabs(xmi, setXmi, name, subname) {
  function handleXmiTabChange(value) {
    setXmi({ ...xmi, activeSource: value });
  }

  function handleXmiFormatChange(value) {
    setXmi({ ...xmi, format: value });
  }

  function handleXmiByTextChange(value) {
    setXmi({ ...xmi, textArea: value });
  }

  function handleXmiUrlChange(value) {
    setXmi({ ...xmi, url: value });
  }

  function handleXmiFileUpload(value) {
    setXmi({ ...xmi, file: value });
  }

  return (
    <UMLTabs
      name={name}
      subname={subname}
      activeSource={xmi.activeSource}
      handleTabChange={handleXmiTabChange}
      textAreaValue={xmi.textArea}
      handleByTextChange={handleXmiByTextChange}
      urlValue={xmi.url}
      handleXmiUrlChange={handleXmiUrlChange}
      handleFileUpload={handleXmiFileUpload}
      selectedFormat={xmi.format}
      handleFormatChange={handleXmiFormatChange}
      setCodeMirror={(cm) => setXmi({ ...xmi, codeMirror: cm })}
      fromParams={xmi.fromParams}
      resetFromParams={() => setXmi({ ...xmi, fromParams: false })}
    />
  );
}

export function UMLParamsFromQueryParams(params) {
  let newParams = {};
  if (params.schema) newParams["schema"] = params.schema;
  if (params.schemaFormat) newParams["schemaFormat"] = params.schemaFormat;
  if (params.schemaUrl) newParams["schemaUrl"] = params.schemaUrl;
  if (params.schemaFile) newParams["schemaFile"] = params.schemaFile;
  return newParams;
}

export function getUmlText(xmi) {
  if (xmi.activeSource === API.sources.byText) {
    return xmi.textArea;
  } else if (xmi.activeSource === API.sources.byUrl) {
    return xmi.url;
  }
  return "";
}
