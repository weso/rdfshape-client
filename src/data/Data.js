import API from '../API';
import DataTabs from "./DataTabs";
import React from "react";

export const InitialData = {
    activeTab: API.defaultTab,
    textArea: '',
    url: '',
    file: null,
    format: API.defaultDataFormat,
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
    let params = {};
    params['activeTab'] = convertTabData(data.activeTab);
    params['dataFormat'] = data.format;
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


export function mkDataTabs(data, setData, name) {

    function handleDataTabChange(value) { setData({...data, activeTab: value}); }
    function handleDataFormatChange(value) {  setData({...data, format: value}); }
    function handleDataByTextChange(value) { setData({...data, textArea: value}); }
    function handleDataUrlChange(value) { setData( {...data, url: value}); }
    function handleDataFileUpload(value) { setData({...data, file: value }); }

    return (<DataTabs
              name={name || "RDF data"}
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
              resetFromParams={() => setData({...data, fromParams: false}) }
    />);

}