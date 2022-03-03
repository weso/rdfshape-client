import React from "react";
import shumlex from "shumlex";
import API from "../API";
import { shumlexCytoscapeStyle } from "../utils/cytoscape/cytoUtils";
import axios from "../utils/networking/axiosConfig";
import { getItemRaw } from "../utils/Utils";
import ShowVisualization, {
  visualizationTypes
} from "../visualization/ShowVisualization";
import ShexTabs from "./ShexTabs";

export const InitialShex = {
  activeSource: API.sources.default,
  textArea: "",
  url: "",
  file: null,
  format: API.formats.defaultShex,
  engine: API.engines.defaultShex,
  triggerMode: API.triggerModes.shapeMap,
  fromParams: false,
  codeMirror: null,
};

export function updateStateShex(params, shex) {
  // Only update state if there is shex
  if (params[API.queryParameters.schema.schema]) {
    // Get the raw data string introduced by the user
    const userSchema = params[API.queryParameters.schema.schema];
    // Get the schema source to be used: take it from params or resort to default
    const schemaSource =
      params[API.queryParameters.schema.source] || API.sources.default;

    // Compose new Schema State building from the old one
    return {
      ...shex,
      activeSource: schemaSource,
      // Fill in the data containers with the user data if necessary. Else leave them as they were.
      textArea:
        schemaSource == API.sources.byText ? userSchema : shex?.textArea,
      url: schemaSource == API.sources.byUrl ? userSchema : shex?.url,
      file: schemaSource == API.sources.byFile ? userSchema : shex?.file,
      fromParams: true,
      format: params[API.queryParameters.schema.format] || shex?.format,
      // Get the schema engine or leave it as is
      engine: params[API.queryParameters.schema.engine] || shex?.engine,
    };
  }
  return shex;
}

export function paramsFromStateShex(shex) {
  let params = {};
  params[API.queryParameters.schema.source] = shex.activeSource;
  params[API.queryParameters.schema.format] = shex.format;
  params[API.queryParameters.schema.engine] = shex.engine;
  params[API.queryParameters.schema.triggerMode] = API.triggerModes.shapeMap;

  // Send the "schema" param to the server, that will use the "schemaSource" to know hot to treat the schema (raw, URL, file...)
  switch (shex.activeSource) {
    case API.sources.byText:
      params[API.queryParameters.schema.schema] = shex.textArea.trim();
      break;
    case API.sources.byUrl:
      params[API.queryParameters.schema.schema] = shex.url.trim();
      break;
    case API.sources.byFile:
      params[API.queryParameters.schema.schema] = shex.file;
      break;
  }
  return params;
}

export function getShexText(shex) {
  if (shex.activeSource === API.sources.byText) {
    return encodeURI(shex.textArea.trim());
  } else if (shex.activeSource === API.sources.byUrl) {
    return encodeURI(shex.url.trim());
  }
  return "";
}

export function mkShexTabs(shex, setShex, name, subname) {
  function handleShexTabChange(value) {
    setShex({ ...shex, activeSource: value });
  }

  function handleShexByTextChange(value) {
    setShex({ ...shex, textArea: value });
  }

  function handleShexUrlChange(value) {
    setShex({ ...shex, url: value });
  }

  function handleShexFileUpload(value) {
    setShex({ ...shex, file: value });
  }

  function handleShexFormatChange(value) {
    setShex({ ...shex, format: value });
  }

  return (
    <ShexTabs
      shex={shex}
      name={name}
      subname={subname}
      activeSource={shex.activeSource}
      handleTabChange={handleShexTabChange}
      textAreaValue={shex.textArea}
      handleByTextChange={handleShexByTextChange}
      urlValue={shex.url}
      handleShExUrlChange={handleShexUrlChange}
      handleFileUpload={handleShexFileUpload}
      selectedFormat={shex.format}
      handleShExFormatChange={handleShexFormatChange}
      setCodeMirror={(cm) => setShex({ ...shex, codeMirror: cm })}
      fromParams={shex.fromParams}
      resetFromParams={() => setShex({ ...shex, fromParams: false })}
    />
  );
}

// Prepare basic server params for when shex is sent to server
export async function mkShexServerParams(shex) {
  return {
    // If by file, parse contents in client before sending
    [API.queryParameters.content]:
      shex.activeSource === API.sources.byFile
        ? await getItemRaw(shex)
        : shex.activeSource === API.sources.byUrl
        ? shex.url
        : shex.textArea,
    [API.queryParameters.source]: shex.activeSource,
    [API.queryParameters.format]: shex.format,
    [API.queryParameters.engine]: shex.engine,
  };
}

export async function mkShexVisualization(
  params,
  visualizationTarget,
  options = { controls: false }
) {
  switch (visualizationTarget) {
    case API.queryParameters.visualization.targets.svg:
      const { data: resultConvert } = await axios.post(
        API.routes.server.schemaConvert,
        params
      );

      return (
        <ShowVisualization
          data={resultConvert?.result?.content} // Extract SVG from response
          type={visualizationTypes.svgRaw}
          {...options}
        />
      );

    case API.queryParameters.visualization.targets.cyto:
      // Get the raw ShEx text via SchemaInfo
      const { data: resultInfo } = await axios.post(
        API.routes.server.schemaInfo,
        params
      );
      const schemaRaw = resultInfo?.schema?.content;

      // Make the cytoscape elements via Shumlex
      const cytoElements = shumlex.crearGrafo(schemaRaw);

      return (
        <ShowVisualization
          data={{
            elements: cytoElements,
            stylesheet: shumlexCytoscapeStyle,
          }}
          type={visualizationTypes.cytoscape}
          {...options}
        />
      );
  }
}
