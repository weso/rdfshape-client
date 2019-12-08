import API from '../API';
import {convertTabData} from "../Utils";

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

export const InitialData = {
    activeTab: API.defaultTab,
    textArea: '',
    url: '',
    file: null,
    format: API.defaultDataFormat,
    fromParams: false
};