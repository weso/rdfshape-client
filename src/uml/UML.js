import React from "react";
import API from "../API";
import UMLTabs from "./UMLTabs";

export const InitialUML = {
  activeTab: API.defaultTab,
  textArea: "",
  url: "",
  file: null,
  format: API.defaultXMLFormat,
  fromParams: false,
  codeMirror: null,
};

export function convertTabSchema(key) {
  switch (key) {
    case API.byTextTab:
      return "#schemaTextArea";
    case API.byFileTab:
      return "#schemaFile";
    case API.byUrlTab:
      return "#schemaUrl";
    default:
      console.info("Unknown schemaTab: " + key);
      return key;
  }
}

export function paramsFromStateUML(state) {
  const activeTab = state.activeTab;
  const textArea = state.textArea;
  const format = state.format;
  const url = state.url;
  const file = state.file;
  let params = {};
  params["activeSchemaTab"] = convertTabSchema(activeTab);
  params["schemaEmbedded"] = false;
  params["schemaFormat"] = format;
  switch (activeTab) {
    case API.byTextTab:
      params["schema"] = textArea;
      params["schemaFormatTextArea"] = format;
      break;
    case API.byUrlTab:
      params["schemaURL"] = url;
      params["schemaFormatUrl"] = format;
      break;
    case API.byFileTab:
      params["schemaFile"] = file;
      params["schemaFormatFile"] = format;
      break;
    default:
  }
  return params;
}

export function updateStateUML(params, xmi) {
  if (params["schema"]) {
    return {
      ...xmi,
      activeTab: API.byTextTab,
      textArea: params["schema"],
      fromParams: true,
      format: params["schemaFormat"] ? params["schemaFormat"] : xmi.format,
    };
  }
  if (params["schemaURL"]) {
    return {
      ...xmi,
      activeTab: API.byUrlTab,
      url: params["schemaURL"],
      fromParams: false,
      format: params["schemaFormat"] ? params["schemaFormat"] : xmi.format,
    };
  }
  if (params["schemaFile"]) {
    return {
      ...xmi,
      activeTab: API.byFileTab,
      file: params["schemaFile"],
      fromParams: false,
      format: params["schemaFormat"] ? params["schemaFormat"] : xmi.format,
    };
  }
  return xmi;
}

export function mkUMLTabs(xmi, setXmi, name, subname) {
  function handleXmiTabChange(value) {
    setXmi({ ...xmi, activeTab: value });
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
      activeTab={xmi.activeTab}
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
  if (params.schemaURL) newParams["schemaURL"] = params.schemaURL;
  if (params.schemaFile) newParams["schemaFile"] = params.schemaFile;
  return newParams;
}

export function getUmlText(xmi) {
  if (xmi.activeTab === API.byTextTab) {
    return xmi.textArea;
  } else if (xmi.activeTab === API.byUrlTab) {
    return xmi.url;
  }
  return "";
}
