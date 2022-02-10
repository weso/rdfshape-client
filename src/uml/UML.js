import React from "react";
import shumlex from "shumlex";
import API from "../API";
import { getConverterInput } from "../utils/xmiUtils/shumlexUtils";
import ShowVisualization, {
  visualizationTypes
} from "../visualization/ShowVisualization";
import UMLTabs from "./UMLTabs";

// UML data representation (XMI)
export const InitialUML = {
  activeSource: API.defaultTab,
  textArea: "",
  url: "",
  file: null,
  format: API.formats.xml,
  fromParams: false,
  codeMirror: null,
};

export function updateStateUml(params, uml) {
  if (params[API.queryParameters.uml.uml]) {
    const userUml = params[API.queryParameters.uml.uml];
    const umlSource =
      params[API.queryParameters.uml.source] || API.sources.default;
    return {
      ...uml,
      activeSource: umlSource,
      textArea: umlSource == API.sources.byText ? userUml : uml?.textArea,
      url: umlSource == API.sources.byUrl ? userUml : uml?.url,
      file: umlSource == API.sources.byFile ? userUml : uml?.file,
      fromParams: true,
      format: params[API.queryParameters.uml.format] || uml?.format,
    };
  }

  return uml;
}

export function paramsFromStateUML(uml) {
  let params = {};
  params[API.queryParameters.uml.source] = uml.activeSource;
  params[API.queryParameters.uml.format] = uml.format;

  switch (uml.activeSource) {
    case API.sources.byText:
      params[API.queryParameters.uml.uml] = uml.textArea.trim();
      break;
    case API.sources.byUrl:
      params[API.queryParameters.uml.uml] = uml.url.trim();
      break;
    case API.sources.byFile:
      params[API.queryParameters.uml.uml] = uml.file;
      break;
  }
  return params;
}

export function mkUMLTabs(uml, setUml, name, subname) {
  function handleXmiTabChange(value) {
    setUml({ ...uml, activeSource: value });
  }

  function handleXmiFormatChange(value) {
    setUml({ ...uml, format: value });
  }

  function handleXmiByTextChange(value) {
    setUml({ ...uml, textArea: value });
  }

  function handleXmiUrlChange(value) {
    setUml({ ...uml, url: value });
  }

  function handleXmiFileUpload(value) {
    setUml({ ...uml, file: value });
  }

  return (
    <UMLTabs
      name={name}
      subname={subname}
      activeSource={uml.activeSource}
      handleTabChange={handleXmiTabChange}
      textAreaValue={uml.textArea}
      handleByTextChange={handleXmiByTextChange}
      urlValue={uml.url}
      handleXmiUrlChange={handleXmiUrlChange}
      handleFileUpload={handleXmiFileUpload}
      selectedFormat={uml.format}
      handleFormatChange={handleXmiFormatChange}
      setCodeMirror={(cm) => setUml({ ...uml, codeMirror: cm })}
      fromParams={uml.fromParams}
      resetFromParams={() => setUml({ ...uml, fromParams: false })}
    />
  );
}

export function getUmlText(uml) {
  if (uml.activeSource === API.sources.byText) {
    return uml.textArea;
  } else if (uml.activeSource === API.sources.byUrl) {
    return uml.url;
  }
  return "";
}

export const mkSvgElement = (umlRaw) => {
  const dummyId = "dummy-uml-placeholder";
  // Create a dummy HTML element to put the SVG into
  const dummy = document.createElement("div");
  dummy.id = dummyId;
  document.body.appendChild(dummy);

  // Use Shumlex to create the SVG data (binary)...
  shumlex.crearDiagramaUML(dummyId, umlRaw);
  let svg64 = shumlex.base64SVG(dummyId);
  // ...and decode the binary to get the inline SVG element to be represented
  const inlineSvg = Buffer.from(
    svg64.replace("data:image/svg+xml;base64,", ""),
    "base64"
  ).toString();

  // Remove dummy element and return
  dummy.remove();

  return inlineSvg;
};

export async function mkUmlVisualization(
  params,
  visualizationTarget,
  options = { controls: false }
) {
  switch (visualizationTarget) {
    case API.queryParameters.visualization.targets.svg:
      // Recover raw UML data
      const raw = await getConverterInput(params, false);
      return (
        <ShowVisualization
          data={mkSvgElement(raw)}
          type={visualizationTypes.svgRaw}
          {...options}
        />
      );
  }
}
