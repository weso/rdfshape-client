import React from "react";
import API from "../API";
import ShapeMapTabs from "./ShapeMapTabs";

export const InitialShapeMap = {
  activeSource: API.sources.default,
  textArea: "",
  url: "",
  file: null,
  format: API.formats.defaultShapeMap,
  triggerMode: API.triggerModes.shapeMap,
  fromParams: false,
  codeMirror: null,
};

export function updateStateShapeMap(params, shapeMap) {
  // Only update state if there is data
  if (params[API.queryParameters.shapeMap.shapeMap]) {
    // Get the raw data string introduced by the user
    const userData = params[API.queryParameters.shapeMap.shapeMap];
    // Get the data source to be used: take it from params or resort to default
    const shapeMapSource =
      params[API.queryParameters.shapeMap.source] || API.sources.default;

    // Compose new Shapemap State building from the old one
    return {
      ...shapeMap,
      activeSource: shapeMapSource,
      textArea:
        shapeMapSource == API.sources.byText ? userData : shapeMap.textArea, // Fill in the data containers with the user data if necessary. Else leave them as they were.
      url: shapeMapSource == API.sources.byUrl ? userData : shapeMap.url,
      file: shapeMapSource == API.sources.byFile ? userData : shapeMap.file,
      fromParams: true,
      format: params[API.queryParameters.shapeMap.format] || shapeMap.format,
    };
  }
  return shapeMap;
}

export function paramsFromStateShapemap(shapeMap) {
  let params = {};
  params[API.queryParameters.shapeMap.source] = shapeMap.activeSource;
  params[API.queryParameters.shapeMap.format] = shapeMap.format;
  params[API.queryParameters.schema.triggerMode] = shapeMap.triggerMode;
  switch (shapeMap.activeSource) {
    case API.sources.byText:
      params[API.queryParameters.shapeMap.shapeMap] = shapeMap.textArea.trim();
      break;
    case API.sources.byUrl:
      params[API.queryParameters.shapeMap.shapeMap] = shapeMap.url.trim();
      break;
    case API.sources.byFile:
      params[API.queryParameters.shapeMap.shapeMap] = shapeMap.file;
      break;
    default:
  }
  return params;
}

export function mkShapeMapTabs(shapeMap, setShapeMap, name, subname) {
  function handleShapeMapTabChange(value) {
    setShapeMap({ ...shapeMap, activeSource: value });
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
      activeSource={shapeMap.activeSource}
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
  if (shapeMap.activeSource === API.sources.byText) {
    return encodeURI(shapeMap.textArea.trim());
  } else if (shapeMap.activeSource === API.sources.byUrl) {
    return encodeURI(shapeMap.url.trim());
  }
  return "";
}
