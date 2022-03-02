import React from "react";
import API from "../API";
import { processDotData } from "../utils/dot/dotUtils";
import axios from "../utils/networking/axiosConfig";
import { getItemRaw } from "../utils/Utils";
import ShowVisualization, {
  visualizationTypes
} from "../visualization/ShowVisualization";
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
      textArea: dataSource == API.sources.byText ? userData : data?.textArea,
      url: dataSource == API.sources.byUrl ? userData : data?.url,
      file: dataSource == API.sources.byFile ? userData : data?.file,
      fromParams: true,
      format: params[API.queryParameters.data.format] || data?.format,
      inference: params[API.queryParameters.data.inference] || data?.inference,
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

  function handleCodeMirrorChange(value) {
    setData({ ...data, codeMirror: value });
  }
  const resetParams = () => setData({ ...data, fromParams: false });

  return (
    <React.Fragment>
      <DataTabs
        data={data}
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
        setCodeMirror={handleCodeMirrorChange}
        fromParams={data.fromParams}
        resetFromParams={resetParams}
      />
      <SelectInferenceEngine
        data={data}
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

// Prepare basic server params for when data is sent to the server
export async function mkDataServerParams(data) {
  return {
    // If by file, parse contents in client before sending
    [API.queryParameters.content]:
      data.activeSource === API.sources.byFile
        ? await getItemRaw(data)
        : data.activeSource === API.sources.byUrl
        ? data.url
        : data.textArea,
    [API.queryParameters.source]: data.activeSource,
    [API.queryParameters.format]: data.format,
    [API.queryParameters.inference]: data.inference,
  };
}

export async function mkDataVisualization(
  params,
  visualizationTarget,
  options = { controls: false }
) {
  switch (visualizationTarget) {
    case API.queryParameters.visualization.targets.svg:
      const { data: resultDot } = await axios.post(
        API.routes.server.dataConvert,
        params
      );
      const dot = resultDot.result.content; // Get the DOT string from the axios data object
      const dotVisualization = await processDotData(dot);

      return (
        <ShowVisualization
          data={dotVisualization.data}
          type={visualizationTypes.svgObject}
          {...options}
        />
      );
    case API.queryParameters.visualization.targets.cyto:
      const { data: resultCyto } = await axios.post(
        API.routes.server.dataConvert,
        params
      );
      const cytoElements = JSON.parse(resultCyto.result.content);

      return (
        <ShowVisualization
          data={{ elements: cytoElements }}
          type={visualizationTypes.cytoscape}
          {...options}
        />
      );
  }
}
