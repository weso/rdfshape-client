import React from "react";
import API from "../API";
import ShapeMapTabs from "./ShapeMapTabs";

export const InitialShapemap = {
  activeSource: API.sources.default,
  textArea: "",
  url: "",
  file: null,
  format: API.formats.defaultShapeMap,
  fromParams: false,
  codeMirror: null,
};

export function paramsFromStateShapemap(shapemap) {
  let params = {};
  params["shapemapSource"] = shapemap.activeSource;
  params["shapemapFormat"] = shapemap.format;
  switch (shapemap.activeSource) {
    case API.sources.byText:
      params["shapemap"] = shapemap.textArea.trim();
      break;
    case API.sources.byUrl:
      params["shapemap"] = shapemap.url.trim();
      break;
    case API.sources.byFile:
      params["shapemap"] = shapemap.file;
      break;
    default:
  }
  return params;
}

export function updateStateShapeMap(params, shapemap) {
  // Only update state if there is data
  if (params["shapemap"]) {
    // Get the raw data string introduced by the user
    const userData = params["shapemap"];
    // Get the data source to be used: take it from params or resort to default
    const shapemapSource = params["shapemapSource"] || API.sources.default;

    // Compose new Shapemap State building from the old one
    return {
      ...shapemap,
      activeSource: shapemapSource,
      textArea: shapemapSource == API.sources.byText ? userData : shapemap.textArea, // Fill in the data containers with the user data if necessary. Else leave them as they were.
      url: shapemapSource == API.sources.byUrl ? userData : shapemap.url,
      file: shapemapSource == API.sources.byFile ? userData : shapemap.file,
      fromParams: true,
      format: params["shapemapFormat"] || API.formats.defaultShapeMap,
    };
  }
  return shapemap;
}

export function shapemapParamsFromQueryParams(params) {
  let newParams = {};
  if (params.shapemap) newParams["shapemap"] = params.shapemap;
  if (params.shapemapSource) newParams["shapemapSource"] = params.shapemapSource;
  if (params.shapemapFormat)
    newParams["shapemapFormat"] = params.shapemapFormat;
  return newParams;
}

export function mkShapeMapTabs(shapemap, setShapeMap, name, subname) {
  function handleShapeMapTabChange(value) {
    setShapeMap({ ...shapemap, activeSource: value });
  }

  function handleShapeMapFormatChange(value) {
    setShapeMap({ ...shapemap, format: value });
  }

  function handleShapeMapByTextChange(value) {
    setShapeMap({ ...shapemap, textArea: value });
  }

  function handleShapeMapUrlChange(value) {
    setShapeMap({ ...shapemap, url: value });
  }

  function handleShapeMapFileUpload(value) {
    setShapeMap({ ...shapemap, file: value });
  }

  return (
    <ShapeMapTabs
      name={name}
      subname={subname}
      activeSource={shapemap.activeSource}
      handleTabChange={handleShapeMapTabChange}
      textAreaValue={shapemap.textArea}
      handleByTextChange={handleShapeMapByTextChange}
      urlValue={shapemap.url}
      handleUrlChange={handleShapeMapUrlChange}
      handleFileUpload={handleShapeMapFileUpload}
      selectedFormat={shapemap.format}
      handleFormatChange={handleShapeMapFormatChange}
      setCodeMirror={(cm) => setInterval({ ...shapemap, codeMirror: cm })}
      fromParams={shapemap.fromParams}
      resetFromParams={() => setShapeMap({ ...shapemap, fromParams: false })}
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
