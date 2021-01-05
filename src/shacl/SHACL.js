import React from "react";
import API from "../API";
import SelectSHACLEngine from "../components/SelectSHACLEngine";
import SelectInferenceEngine from "../data/SelectInferenceEngine";
import { convertTabSchema } from "../shex/ShEx";
import SHACLTabs from "./SHACLTabs";

/*export const initialSHACLStatus = {

    shaclActiveTab: API.defaultTab,
    shaclTextArea: '',
    shaclUrl: '',
    shaclFormat: API.defaultSHACLFormat
} ; */

export const InitialShacl = {
  activeTab: API.defaultTab,
  textArea: "",
  url: "",
  file: null,
  format: API.defaultSHACLFormat,
  engine: API.defaultSHACLEngine,
  fromParams: false,
  codeMirror: null,
  inference: "none",
};

/*export function shaclReducer(status,action) {
    switch (action.type) {
        case 'changeTab':
            return {
                ...status,
                shaclActiveTab: action.value
            }
        case 'setText':
            return {
                ...status,
                shaclActiveTab: API.byTextTab,
                shaclTextArea: action.value
            }
        case 'setUrl':
            return { ...status,
                shaclActiveTab: API.byUrlTab,
                shaclUrl: action.value
            }
        case 'setFile':
            return {
                ...status,
                shaclActiveTab: API.byFileTab,
                shaclFile: action.value
            }
        case 'setFormat':
            return { ...status,
                shaclFormat: action.value
            }
        default:
            return new Error(`shaclReducer: unknown action type: ${action.type}`)
    }
}*/

export function updateStateShacl(params, shacl) {
  if (params["schema"]) {
    return {
      ...shacl,
      activeTab: API.byTextTab,
      textArea: params["schema"],
      fromParams: true,
      format: params["schemaFormat"] ? params["schemaFormat"] : shacl.format,
      engine: params["schemaEngine"] ? params["schemaEngine"] : shacl.engine,
      inference: params["schemaInference"] ? params["schemaInference"] : shacl.inference,
    };
  }
  if (params["schemaURL"]) {
    return {
      ...shacl,
      activeTab: API.byUrlTab,
      url: params["schemaURL"],
      fromParams: false,
      format: params["schemaFormat"] ? params["schemaFormat"] : shacl.format,
      engine: params["schemaEngine"] ? params["schemaEngine"] : shacl.engine,
      inference: params["schemaInference"] ? params["schemaInference"] : shacl.inference,
    };
  }
  if (params["schemaFile"]) {
    return {
      ...shacl,
      activeTab: API.byFileTab,
      file: params["schemaFile"],
      fromParams: false,
      format: params["schemaFormat"] ? params["schemaFormat"] : shacl.format,
      engine: params["schemaEngine"] ? params["schemaEngine"] : shacl.engine,
      inference: params["schemaInference"] ? params["schemaInference"] : shacl.inference,
    };
  }
  return shacl;
}

export function paramsFromStateShacl(state) {
  const activeTab = state.activeTab;
  const textArea = state.textArea;
  const format = state.format;
  const url = state.url;
  const file = state.file;
  const engine = state.engine;
  const inference = state.inference;
  let params = {};
  params["activeSchemaTab"] = convertTabSchema(activeTab);
  params["schemaFormat"] = format;
  params["schemaEngine"] = engine;
  params["schemaInference"] = inference;
  params["schemaEmbedded"] = false;
  switch (activeTab) {
    case API.byTextTab:
      params["schema"] = textArea.trim();
      params["schemaFormatTextArea"] = format;
      break;
    case API.byUrlTab:
      params["schemaURL"] = url.trim();
      params["schemaFormatUrl"] = format;
      break;
    case API.byFileTab:
      params["schemaFile"] = file;
      params["schemaFormatFile"] = format;
      break;
    default:
  }
  return params;
}

/*export function paramsFromShacl(status) {
    let params = {};
    params['activeSchemaTab'] = convertTabSchema(status.shaclActiveTab);
    params['schemaEmbedded'] = false;
    params['schemaFormat'] = status.shaclFormat;
    switch (status.shaclActiveTab) {
        case API.byTextTab:
            params['schema'] = status.shaclTextArea;
            params['schemaFormatTextArea'] = status.shaclFormat;
            break;
        case API.byUrlTab:
            params['schemaURL'] = status.shaclUrl;
            params['schemaFormatUrl'] = status.shaclFormat;
            break;
        case API.byFileTab:
            params['schemaFile'] = status.shaclFile;
            params['schemaFormatFile'] = status.shaclFormat;
            break;
        default:
    }
    return params;
}*/

export function shaclParamsFromQueryParams(params) {
  let newParams = {};
  if (params.schema) newParams["schema"] = params.schema;
  if (params.schemaFormat) newParams["schemaFormat"] = params.schemaFormat;
  if (params.schemaURL) newParams["schemaURL"] = params.schemaURL;
  if (params.schemaEngine) newParams["schemaEngine"] = params.schemaEngine;
  if (params.schemaInference) newParams["schemaInference"] = params.schemaInference;
  if (params.schemaFile) newParams["schemaFile"] = params.schemaFile;
  return newParams;
}

export function mkShaclTabs(shacl, setShacl, name, subname) {
  function handleShaclTabChange(value) {
    setShacl({ ...shacl, activeTab: value });
  }
  function handleShaclFormatChange(value) {
    setShacl({ ...shacl, format: value });
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

  function handleSHACLEngineChange(value) {
    setShacl({ ...shacl, engine: value });
  }
  const resetParams = () => setShacl({ ...shacl, fromParams: false });

  return (
    <React.Fragment>
      <SHACLTabs
        name={name}
        subname={subname}
        activeTab={shacl.activeTab}
        handleTabChange={handleShaclTabChange}
        textAreaValue={shacl.textArea}
        handleByTextChange={handleShaclByTextChange}
        urlValue={shacl.url}
        handleDataUrlChange={handleShaclUrlChange}
        handleFileUpload={handleShaclFileUpload}
        selectedFormat={shacl.format}
        handleDataFormatChange={handleShaclFormatChange}
        setCodeMirror={(cm) => setShacl({ ...shacl, codeMirror: cm })}
        fromParams={shacl.fromParams}
        resetFromParams={resetParams}
      />
      <SelectSHACLEngine
        handleSHACLEngineChange={handleSHACLEngineChange}
        selectedSHACLEngine={shacl.engine}
        fromParams={shacl.fromParams}
        resetFromParams={resetParams}
      />

      <SelectInferenceEngine
        handleInferenceChange={handleInferenceChange}
        selectedInference={shacl.inference}
        fromParams={shacl.fromParams}
        resetFromParams={resetParams}
      />
    </React.Fragment>
  );
}

export function getShaclText(shacl) {
  if (shacl.activeTab === API.byTextTab) {
    return encodeURI(shacl.textArea.trim());
  } else if (shacl.activeTab === API.byUrlTab) {
    return encodeURI(shacl.url.trim());
  }
  return "";
}
