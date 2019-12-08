import API from "../API";
import {convertTabSchema} from "../Utils";


export const InitialShEx = {
    activeTab: API.defaultTab,
    textArea: '',
    url: '',
    file: null,
    format: API.defaultShExFormat,
    fromParams: false
};

export function paramsFromStateShEx(state) {
    const activeTab = state.activeTab;
    const textArea = state.textArea;
    const format = state.format;
    const url = state.url;
    const file = state.file;
    let params = {};
    params['activeSchemaTab'] = convertTabSchema(activeTab);
    params['schemaEmbedded'] = false;
    params['schemaFormat'] = format;
    switch (activeTab) {
        case API.byTextTab:
            params['schema'] = textArea;
            params['schemaFormatTextArea'] = format;
            break;
        case API.byUrlTab:
            params['schemaURL'] = url;
            params['schemaFormatUrl'] = format;
            break;
        case API.byFileTab:
            params['schemaFile'] = file;
            params['schemaFormatFile'] = format;
            break;
        default:
    }
    return params;
}

export function updateStateShEx(params, shex) {
    if (params['schema']) {
        return {
            ...shex,
            activeTab: API.byTextTab,
            textArea: params['schema'],
            fromParams: true,
            format: params['schemaFormat'] ? params['schemaFormat'] : shex.format
        };
    }
    if (params['schemaUrl']) {
        return {
            ...shex,
            activeTab: API.byUrlTab,
            url: params['schemaUrl'],
            fromParams: false,
            format: params['schemaFormat'] ? params['schemaFormat'] : shex.format
        }
    }
    if (params['schemaFile']) {
        return {
            ...shex,
            activeTab: API.byFileTab,
            file: params['schemaFile'],
            fromParams: false,
            format: params['schemaFormat'] ? params['schemaFormat'] : shex.format
        }
    }
    return shex;
}