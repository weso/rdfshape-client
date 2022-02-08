import React from "react";
import API from "../API";
import DataTabs from "./DataTabs";
import SelectInferenceEngine from "./SelectInferenceEngine";

export const InitialData = {
  activeSource: API.sources.default,
  textArea: "",
  url: "",
  file: null,
  format: API.formats.defaultData,
  inference: API.inferences.default,
  fromParams: false,
  codeMirror: null,
};

export function updateStateData(params, data) {
  // Only update state if there is data
  if (params[API.queryParameters.data.data]) {
    // Get the raw data string introduced by the user
    const userData = params[API.queryParameters.data.data];
    // Get the data source to be used: take it from params or resort to default
    const dataSource =
      params[API.queryParameters.data.source] || API.sources.default;

    // Compose new Data State building from the old one
    return {
      ...data,
      activeSource: dataSource, // New data source (activates the corresponsing edit tab)
      // Fill in the data containers with the user data if necessary. Else leave them as they were.
      textArea: dataSource == API.sources.byText ? userData : data.textArea,
      url: dataSource == API.sources.byUrl ? userData : data.url,
      file: dataSource == API.sources.byFile ? userData : data.file,
      fromParams: true,
      format: params[API.queryParameters.data.format] || data.format,
      inference: params[API.queryParameters.data.inference] || data.inference,
    };
  }
  return data;
}

export function paramsFromStateData(data) {
  let params = {};
  params[API.queryParameters.data.source] = data.activeSource;
  params[API.queryParameters.data.format] = data.format;
  params[API.queryParameters.data.inference] = data.inference;

  // Send the "data" param to the server, that will use the "dataSource" to know hot to treat the data (raw, URL, file...)
  switch (data.activeSource) {
    case API.sources.byText:
      params[API.queryParameters.data.data] = data.textArea.trim();
      break;
    case API.sources.byUrl:
      params[API.queryParameters.data.data] = data.url.trim();
      break;
    case API.sources.byFile:
      params[API.queryParameters.data.data] = data.file;
      break;
  }
  return params;
}

export function mkDataTabs(
  data,
  setData,
  name,
  subname,
  onTextChange = () => {}
) {
  function handleDataTabChange(value) {
    setData({ ...data, activeSource: value });
  }
  function handleDataByTextChange(value, y, change) {
    onTextChange(value, y, change);
    setData({ ...data, textArea: value });
  }
  function handleDataUrlChange(value) {
    setData({ ...data, url: value });
  }
  function handleDataFileUpload(value) {
    setData({ ...data, file: value });
  }
  function handleDataFormatChange(value) {
    setData({ ...data, format: value });
  }
  function handleInferenceChange(value) {
    setData({ ...data, inference: value });
  }
  const resetParams = () => setData({ ...data, fromParams: false });

  return (
    <React.Fragment>
      <DataTabs
        name={name}
        subname={subname}
        activeSource={data.activeSource}
        handleTabChange={handleDataTabChange}
        textAreaValue={data.textArea}
        handleByTextChange={handleDataByTextChange}
        urlValue={data.url}
        handleDataUrlChange={handleDataUrlChange}
        handleFileUpload={handleDataFileUpload}
        selectedFormat={data.format}
        handleDataFormatChange={handleDataFormatChange}
        setCodeMirror={(cm) => setData({ ...data, codeMirror: cm })}
        fromParams={data.fromParams}
        resetFromParams={resetParams}
      />
      <SelectInferenceEngine
        handleInferenceChange={handleInferenceChange}
        selectedInference={data.inference || InitialData.inference}
        fromParams={data.fromParams}
        resetFromParams={resetParams}
      />
    </React.Fragment>
  );
}

export function getDataText(data) {
  if (data.activeSource === API.sources.byText) {
    return encodeURI(data.textArea.trim());
  } else if (data.activeSource === API.sources.byUrl) {
    return encodeURI(data.url.trim());
  }
  return "";
}
