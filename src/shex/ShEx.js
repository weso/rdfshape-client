import React from "react";
import API from "../API";
import ShExTabs from "./ShExTabs";

export const InitialShEx = {
  activeTab: API.defaultTab,
  textArea: "",
  url: "",
  file: null,
  format: API.defaultShExFormat,
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

export function paramsFromStateShEx(state) {
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
      params["schema"] = textArea.trim();
      params["schemaFormatTextArea"] = format;
      break;
    case API.byUrlTab:
      params["schemaURL"] = url.trim();
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

export function updateStateShEx(params, shex) {
  if (params["schema"]) {
    return {
      ...shex,
      activeTab: API.byTextTab,
      textArea: params["schema"],
      fromParams: true,
      format: params["schemaFormat"] ? params["schemaFormat"] : shex.format,
    };
  }
  if (params["schemaURL"]) {
    return {
      ...shex,
      activeTab: API.byUrlTab,
      url: params["schemaURL"],
      fromParams: false,
      format: params["schemaFormat"] ? params["schemaFormat"] : shex.format,
    };
  }
  if (params["schemaFile"]) {
    return {
      ...shex,
      activeTab: API.byFileTab,
      file: params["schemaFile"],
      fromParams: false,
      format: params["schemaFormat"] ? params["schemaFormat"] : shex.format,
    };
  }
  return shex;
}

export function mkShExTabs(shex, setShEx, name, subname) {
  function handleShExTabChange(value) {
    setShEx({ ...shex, activeTab: value });
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
      activeTab={shex.activeTab}
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
  if (params.schemaURL) newParams["schemaURL"] = params.schemaURL;
  if (params.schemaFile) newParams["schemaFile"] = params.schemaFile;
  return newParams;
}

export function getShexText(shex) {
  if (shex.activeTab === API.byTextTab) {
    return encodeURI(shex.textArea.trim());
  } else if (shex.activeTab === API.byUrlTab) {
    return encodeURI(shex.url.trim());
  }
  return "";
}
