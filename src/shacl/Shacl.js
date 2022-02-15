import axios from "axios";
import React from "react";
import API from "../API";
import { SelectSHACLEngine } from "../components/SelectEngine";
import SelectInferenceEngine from "../data/SelectInferenceEngine";
import { params2Form } from "../Permalink";
import ShowVisualization, {
  visualizationTypes
} from "../visualization/ShowVisualization";
import ShaclTabs from "./ShaclTabs";

export const InitialShacl = {
  activeSource: API.sources.default,
  textArea: "",
  url: "",
  file: null,
  format: API.formats.defaultShacl,
  engine: API.engines.defaultShacl,
  inference: API.inferences.none,
  triggerMode: API.triggerModes.targetDecls,
  fromParams: false,
  codeMirror: null,
};

export function updateStateShacl(params, shacl) {
  if (params[API.queryParameters.schema.schema]) {
    const userSchema = params[API.queryParameters.schema.schema];
    const schemaSource =
      params[API.queryParameters.schema.source] || API.sources.default;

    return {
      ...shacl,
      activeSource: schemaSource,
      textArea:
        schemaSource == API.sources.byText ? userSchema : shacl?.textArea,
      url: schemaSource == API.sources.byUrl ? userSchema : shacl?.url,
      file: schemaSource == API.sources.byFile ? userSchema : shacl?.file,
      fromParams: true,
      format: params[API.queryParameters.schema.format] || shacl?.format,
      engine: params[API.queryParameters.schema.engine] || shacl?.engine,
      inference:
        params[API.queryParameters.schema.inference] || shacl?.inference,
    };
  }
  return shacl;
}

export function paramsFromStateShacl(shacl) {
  let params = {};
  params[API.queryParameters.schema.source] = shacl.activeSource;
  params[API.queryParameters.schema.format] = shacl.format;
  params[API.queryParameters.schema.engine] = shacl.engine;
  params[API.queryParameters.schema.inference] = shacl.inference;
  params[API.queryParameters.schema.triggerMode] = shacl.triggerMode;

  switch (shacl.activeSource) {
    case API.sources.byText:
      params[API.queryParameters.schema.schema] = shacl.textArea.trim();
      break;
    case API.sources.byUrl:
      params[API.queryParameters.schema.schema] = shacl.url.trim();
      break;
    case API.sources.byFile:
      params[API.queryParameters.schema.schema] = shacl.file;
      break;
    default:
  }
  return params;
}

export function mkShaclTabs(shacl, setShacl, name, subname) {
  function handleShaclTabChange(value) {
    setShacl({ ...shacl, activeSource: value });
  }
  function handleShaclFormatChange(value) {
    setShacl({ ...shacl, format: value });
  }
  function handleSHACLEngineChange(value) {
    setShacl({ ...shacl, engine: value });
  }
  function handleShaclByTextChange(value) {
    setShacl({ ...shacl, textArea: value });
  }
  function handleShaclUrlChange(value) {
    setShacl({ ...shacl, url: value });
  }
  function handleShaclFileUpload(value) {
    setShacl({ ...shacl, file: value });
  }
  function handleInferenceChange(value) {
    setShacl({ ...shacl, inference: value });
  }

  const resetParams = () => {
    setShacl({ ...shacl, fromParams: false });
  };

  return (
    <React.Fragment>
      <ShaclTabs
        shacl={shacl}
        name={name}
        subname={subname}
        activeSource={shacl.activeSource}
        handleTabChange={handleShaclTabChange}
        textAreaValue={shacl.textArea}
        handleByTextChange={handleShaclByTextChange}
        urlValue={shacl.url}
        handleDataUrlChange={handleShaclUrlChange}
        handleFileUpload={handleShaclFileUpload}
        selectedFormat={shacl.format}
        selectedEngine={shacl.engine}
        handleDataFormatChange={handleShaclFormatChange}
        setCodeMirror={(cm) => setShacl({ ...shacl, codeMirror: cm })}
        fromParams={shacl.fromParams}
        resetFromParams={resetParams}
      />
      <SelectSHACLEngine
        shacl={shacl}
        handleEngineChange={handleSHACLEngineChange}
        selectedEngine={shacl.engine}
        fromParams={shacl.fromParams}
        resetFromParams={resetParams}
      />

      <SelectInferenceEngine
        shacl={shacl}
        handleInferenceChange={handleInferenceChange}
        selectedInference={shacl.inference}
        fromParams={shacl.fromParams}
        resetFromParams={resetParams}
      />
    </React.Fragment>
  );
}

export function getShaclText(shacl) {
  if (shacl.activeSource === API.sources.byText) {
    return encodeURI(shacl.textArea.trim());
  } else if (shacl.activeSource === API.sources.byUrl) {
    return encodeURI(shacl.url.trim());
  }
  return "";
}

export async function mkShaclVisualization(
  params,
  visualizationTarget,
  options = { controls: false }
) {
  const uplinkParams = params2Form(params);
  switch (visualizationTarget) {
    case API.queryParameters.visualization.targets.svg:
      const { data: resultConvert } = await axios.post(
        API.routes.server.schemaConvert,
        uplinkParams
      );

      return (
        <ShowVisualization
          data={resultConvert?.result?.schema} // Extract SVG from response
          type={visualizationTypes.svgRaw}
          {...options}
        />
      );
  }
}
