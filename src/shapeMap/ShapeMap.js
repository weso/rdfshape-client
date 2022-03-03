import React from "react";
import API from "../API";
import { getItemRaw } from "../utils/Utils";
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

export function paramsFromStateShapeMap(shapeMap) {
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
      shapeMap={shapeMap}
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

// Prepare basic server params for when shapeMap is sent to server
export async function mkShapeMapServerParams(shapeMap) {
  return {
    // Send trigger mode for validations
    [API.queryParameters.type]: API.triggerModes.shapeMap,
    // If by file, parse contents in client before sending
    [API.queryParameters.content]:
      shapeMap.activeSource === API.sources.byFile
        ? await getItemRaw(shapeMap)
        : shapeMap.activeSource === API.sources.byUrl
        ? shapeMap.url
        : shapeMap.textArea,
    [API.queryParameters.source]: shapeMap.activeSource,
    [API.queryParameters.format]: shapeMap.format,
  };
}

// Prepare basic server params for when shapeMap is sent to server
export async function mkTriggerModeServerParams(shapeMap) {
  return {
    // Send trigger mode for validations
    [API.queryParameters.type]: API.triggerModes.shapeMap,
    [API.queryParameters.shapeMap.shapeMap]: {
      // If by file, parse contents in client before sending
      [API.queryParameters.content]:
        shapeMap.activeSource === API.sources.byFile
          ? await getItemRaw(shapeMap)
          : shapeMap.activeSource === API.sources.byUrl
          ? shapeMap.url
          : shapeMap.textArea,
      [API.queryParameters.source]: shapeMap.activeSource,
      [API.queryParameters.format]: shapeMap.format,
    },
  };
}

export function getShapeMapText(shapeMap) {
  if (shapeMap.activeSource === API.sources.byText) {
    return encodeURI(shapeMap.textArea.trim());
  } else if (shapeMap.activeSource === API.sources.byUrl) {
    return encodeURI(shapeMap.url.trim());
  }
  return "";
}
