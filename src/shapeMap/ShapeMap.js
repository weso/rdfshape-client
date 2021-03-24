import React from "react";
import API from "../API";
import ShapeMapTabs from "./ShapeMapTabs";

export const InitialShapeMap = {
  activeTab: API.defaultTab,
  textArea: "",
  url: "",
  file: null,
  format: API.defaultShapeMapFormat,
  fromParams: false,
  codeMirror: null,
};

export function convertTabShapeMap(key) {
  switch (key) {
    case API.byTextTab:
      return "#shapeMapTextArea";
    case API.byFileTab:
      return "#shapeMapFile";
    case API.byUrlTab:
      return "#shapeMapUrl";
    default:
      console.info("Unknown shapeMapTab: " + key);
      return key;
  }
}

export function paramsFromStateShapeMap(state) {
  const activeTab = state.activeTab;
  const textArea = state.textArea;
  const format = state.format;
  const url = state.url;
  const file = state.file;
  let params = {};
  params["shapeMapActiveTab"] = convertTabShapeMap(activeTab);
  params["shapeMapFormat"] = format;
  switch (activeTab) {
    case "byText":
      params["shapeMap"] = textArea.trim();
      params["shapeMapFormatTextArea"] = format;
      break;
    case "byUrl":
      params["shapeMapURL"] = url.trim();
      params["shapeMapFormatURL"] = format;
      break;
    case "byFile":
      params["shapeMapFile"] = file;
      params["shapeMapFormatFile"] = format;
      break;
    default:
  }
  return params;
}

export function updateStateShapeMap(params, shapeMap) {
  if (params["shapeMap"]) {
    return {
      ...shapeMap,
      activeTab: API.byTextTab,
      textArea: params["shapeMap"],
      fromParams: true,
      format: params["shapeMapFormat"]
        ? params["shapeMapFormat"]
        : API.defaultShapeMapFormat,
    };
  }
  if (params["shapeMapURL"]) {
    return {
      ...shapeMap,
      activeTab: API.byUrlTab,
      url: params["shapeMapURL"],
      fromParams: false,
      format: params["shapeMapFormat"]
        ? params["shapeMapFormat"]
        : API.defaultShapeMapFormat,
    };
  }
  if (params["shapeMapFile"]) {
    return {
      ...shapeMap,
      activeTab: API.byFileTab,
      file: params["shapeMapFile"],
      fromParams: false,
      format: params["shapeMapFormat"]
        ? params["shapeMapFormat"]
        : API.defaultShapeMapFormat,
    };
  }
  return shapeMap;
}

export function shapeMapParamsFromQueryParams(params) {
  let newParams = {};
  if (params.shapeMap) newParams["shapeMap"] = params.shapeMap;
  if (params.shapeMapFormat)
    newParams["shapeMapFormat"] = params.shapeMapFormat;
  if (params.shapeMapURL) newParams["shapeMapURL"] = params.shapeMapURL;
  if (params.shapeMapFile) newParams["shapeMapFile"] = params.shapeMapFile;
  return newParams;
}

export function mkShapeMapTabs(shapeMap, setShapeMap, name, subname) {
  function handleShapeMapTabChange(value) {
    setShapeMap({ ...shapeMap, activeTab: value });
  }

  function handleShapeMapFormatChange(value) {
    setShapeMap({ ...shapeMap, format: value });
  }

  function handleShapeMapByTextChange(value) {
    setShapeMap({ ...shapeMap, textArea: value });
  }

  function handleShapeMapUrlChange(value) {
    setShapeMap({ ...shapeMap, url: value });
  }

  function handleShapeMapFileUpload(value) {
    setShapeMap({ ...shapeMap, file: value });
  }

  return (
    <ShapeMapTabs
      name={name}
      subname={subname}
      activeTab={shapeMap.activeTab}
      handleTabChange={handleShapeMapTabChange}
      textAreaValue={shapeMap.textArea}
      handleByTextChange={handleShapeMapByTextChange}
      urlValue={shapeMap.url}
      handleUrlChange={handleShapeMapUrlChange}
      handleFileUpload={handleShapeMapFileUpload}
      selectedFormat={shapeMap.format}
      handleFormatChange={handleShapeMapFormatChange}
      setCodeMirror={(cm) => setInterval({ ...shapeMap, codeMirror: cm })}
      fromParams={shapeMap.fromParams}
      resetFromParams={() => setShapeMap({ ...shapeMap, fromParams: false })}
    />
  );
}

export function getShapeMapText(shapeMap) {
  if (shapeMap.activeTab === API.byTextTab) {
    return encodeURI(shapeMap.textArea.trim());
  } else if (shapeMap.activeTab === API.byUrlTab) {
    return encodeURI(shapeMap.url.trim());
  }
  return "";
}
