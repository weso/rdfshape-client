import React from "react";
import API from '../API';
import DataTabs from "./DataTabs";
import SelectInferenceEngine from "./SelectInferenceEngine";

export const InitialData = {
    activeTab: API.defaultTab,
    textArea: '',
    url: '',
    file: null,
    format: API.defaultDataFormat,
    inference: API.defaultInference,
    fromParams: false,
    codeMirror: null
};

export function updateStateData(params, data) {
    if (params['data']) {
        return {
            ...data,
            activeTab: API.byTextTab,
            textArea: params['data'],
            fromParams: true,
            format: params['dataFormat'] ? params['dataFormat'] : API.defaultDataFormat
        };
    }
    if (params['dataUrl']) {
        return {
            ...data,
            activeTab: API.byUrlTab,
            url: params['dataUrl'],
            fromParams: false,
            format: params['dataFormat'] ? params['dataFormat'] : API.defaultDataFormat
        }
    }
    if (params['dataFile']) {
        return {
            ...data,
            activeTab: API.byFileTab,
            file: params['dataFile'],
            fromParams: false,
            format: params['dataFormat'] ? params['dataFormat'] : API.defaultDataFormat
        }
    }
    return data;
}

export function convertTabData(key) {
    switch (key) {
        case API.byTextTab:
            return "#dataTextArea";
        case API.byFileTab:
            return "#dataFile";
        case API.byUrlTab:
            return "#dataUrl";
        default:
            console.log("Unknown schemaTab: " + key);
            return key
    }
}

export function paramsFromStateData(data) {
    // console.log(`ParamsFromStateData, data = ${JSON.stringify(data)}`)
    let params = {};
    params['activeTab'] = convertTabData(data.activeTab);
    params['dataFormat'] = data.format;
    params['inference'] = data.inference;
    switch (data.activeTab) {
        case API.byTextTab:
            params['data'] = data.textArea;
            params['dataFormatTextArea'] = data.format;
            break;
        case API.byUrlTab:
            params['dataURL'] = data.url;
            params['dataFormatUrl'] = data.format;
            break;
        case API.byFileTab:
            params['dataFile'] = data.file;
            params['dataFormatFile'] = data.format;
            break;
        default:
    }
    return params;
}


export function mkDataTabs(data, setData, name, subname) {

    function handleDataTabChange(value) { setData({...data, activeTab: value}); }
    function handleDataFormatChange(value) {  setData({...data, format: value}); }
    function handleDataByTextChange(value) { setData({...data, textArea: value}); }
    function handleDataUrlChange(value) { setData( {...data, url: value}); }
    function handleDataFileUpload(value) { setData({...data, file: value }); }
    function handleInferenceChange(value) {  setData({...data, inference: value}); }
    const resetParams = () => setData({...data, fromParams: false});

    return (
      <React.Fragment>
       <DataTabs
              name={name}
              subname={subname}
              activeTab={data.activeTab}
              handleTabChange={handleDataTabChange}

              textAreaValue={data.textArea}
              handleByTextChange={handleDataByTextChange}

              urlValue={data.url}
              handleDataUrlChange={handleDataUrlChange}

              handleFileUpload={handleDataFileUpload}

              selectedFormat={data.format}
              handleDataFormatChange={handleDataFormatChange}
              setCodeMirror={(cm) => setData({...data, codeMirror: cm}) }

              fromParams={data.fromParams}
              resetFromParams={resetParams} />
        <SelectInferenceEngine
            handleInferenceChange={handleInferenceChange}
            selectedInference={data.inference || InitialData.inference}
            fromParams={data.fromParams}
            resetFromParams={resetParams} />
      </React.Fragment>
   );

}
