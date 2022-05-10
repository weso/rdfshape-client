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

// Properties used for streaming validations.
// Describe the incoming stream and the validator behaviour.
export const InitialDataStream = {
  server: "",
  port: API.kafkaBaseValues.port,
  topic: "",
  haltOnInvalid: false,
  haltOnErrored: false,
  format: API.formats.defaultData,
  inference: API.inferences.default,

  // Hints the UI to change to the Stream input tab
  lastUsed: false,
};

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

// Given the query parameters and current streaming data object
// form a new one with the info in the query params
export function updateStateStreamData(params, streamData) {
  // Compose new Data State building from the old one
  return {
    ...streamData,
    activeSource: API.sources.byStream,
    lastUsed: params[API.queryParameters.data.source] === API.sources.byStream,
    // Fill in the data containers with the user data if necessary. Else leave them as they were.
    server:
      params[API.queryParameters.streaming.stream.server] || streamData?.server,
    port: params[API.queryParameters.streaming.stream.port] || streamData?.port,
    topic:
      params[API.queryParameters.streaming.stream.topic] || streamData?.topic,
    haltOnInvalid:
      params[API.queryParameters.streaming.validator.haltOnInvalid] ||
      streamData?.haltOnInvalid,
    haltOnErrored:
      params[API.queryParameters.streaming.validator.haltOnErrored] ||
      streamData?.haltOnErrored,

    format: params[API.queryParameters.data.format] || streamData?.format,
    inference:
      params[API.queryParameters.data.inference] || streamData?.inference,
  };
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

// State object for streaming data
// Basic data to rebuild it in state
export function paramsFromStateStreamData(streamData) {
  return {
    [API.queryParameters.data.source]: API.sources.byStream,

    [API.queryParameters.streaming.stream.server]: streamData.server,
    [API.queryParameters.streaming.stream.port]: streamData.port,
    [API.queryParameters.streaming.stream.topic]: streamData.topic,
    [API.queryParameters.streaming.validator.haltOnInvalid]:
      streamData.haltOnInvalid,
    [API.queryParameters.streaming.validator.haltOnErrored]:
      streamData.haltOnErrored,

    [API.queryParameters.data.format]: streamData.format,
    [API.queryParameters.data.inference]: streamData.inference,
  };
}

export function mkStreamDataServerParams(data, schemaParams, triggerParams) {
  return {
    [API.queryParameters.streaming.configuration]: {
      [API.queryParameters.streaming.validator.validator]: {
        [API.queryParameters.schema.schema]: schemaParams,
        [API.queryParameters.schema.triggerMode]: triggerParams,

        [API.queryParameters.streaming.validator.haltOnInvalid]:
          data.haltOnInvalid,
        [API.queryParameters.streaming.validator.haltOnErrored]:
          data.haltOnErrored,
      },
      [API.queryParameters.streaming.extractor.extractor]: {
        [API.queryParameters.data.data]: {
          [API.queryParameters.format]: data.format,
          [API.queryParameters.inference]: data.inference,
        },
      },
      [API.queryParameters.streaming.stream.stream]: {
        [API.queryParameters.streaming.stream.server]: data.server,
        [API.queryParameters.streaming.stream.port]: data.port,
        [API.queryParameters.streaming.stream.topic]: data.topic,
      },
    },
  };
}

export function mkDataTabs(
  data,
  setData,
  options = {
    _name: API.texts.dataTabs.dataHeader,
    subname: "",
    onTextChange: () => {},
    // Callback on tab changes
    currentTabStore: null,
    setCurrentTabStore: () => {},
    // Optionally, allow to handle streaming data stored in context
    streamData: {},
    setStreamData: () => {},
    allowStream: false,
  }
) {
  const {
    streamData,
    setStreamData,
    allowStream,
    currentTabStore,
    setCurrentTabStore,
  } = options;

  const isStreamingValidation = () => currentTabStore === API.sources.byStream;

  function handleDataTabChange(value) {
    setCurrentTabStore && setCurrentTabStore(value);
    // Do not change data source, stream data is independent
    if (value !== API.sources.byStream) {
      setData({ ...data, activeSource: value });
      handleStreamChange({ lastUsed: false });
    } else handleStreamChange({ lastUsed: true });
  }
  function handleDataByTextChange(value, y, change) {
    options.onTextChange && options.onTextChange(value, y, change);
    setData({ ...data, textArea: value });
  }
  function handleDataUrlChange(value) {
    setData({ ...data, url: value });
  }
  function handleDataFileUpload(value) {
    setData({ ...data, file: value });
  }
  function handleDataFormatChange(value) {
    // Change the format of the standard data or streaming data:
    if (isStreamingValidation()) handleStreamChange({ format: value });
    else setData({ ...data, format: value });
  }
  function handleInferenceChange(value) {
    // Change the inference of the standard data or streaming data:
    if (isStreamingValidation()) handleStreamChange({ inference: value });
    else setData({ ...data, inference: value });
  }

  function handleCodeMirrorChange(value) {
    setData({ ...data, codeMirror: value });
  }

  function handleStreamChange(value) {
    setStreamData && setStreamData({ ...streamData, ...value });
  }

  const resetParams = () => setData({ ...data, fromParams: false });

  return (
    <React.Fragment>
      <DataTabs
        data={data}
        name={options._name}
        subname={options.subname}
        activeSource={
          allowStream && streamData.lastUsed === true
            ? API.sources.byStream
            : data.activeSource
        }
        handleTabChange={handleDataTabChange}
        textAreaValue={data.textArea}
        handleByTextChange={handleDataByTextChange}
        urlValue={data.url}
        handleDataUrlChange={handleDataUrlChange}
        handleFileUpload={handleDataFileUpload}
        selectedFormat={
          isStreamingValidation() ? streamData.format : data.format
        }
        handleDataFormatChange={handleDataFormatChange}
        setCodeMirror={handleCodeMirrorChange}
        fromParams={data.fromParams}
        resetFromParams={resetParams}
        streamValue={streamData}
        handleStreamChange={handleStreamChange}
        allowStream={allowStream}
      />
      <SelectInferenceEngine
        data={data}
        handleInferenceChange={handleInferenceChange}
        selectedInference={
          isStreamingValidation()
            ? streamData.inference || InitialDataStream.inference
            : data.inference || InitialData.inference
        }
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

export function getStreamingDataText(streamData) {
  return `${streamData.server}:${streamData.port}@${streamData.topic}`;
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
