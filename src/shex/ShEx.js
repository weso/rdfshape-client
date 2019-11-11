import API from "../API";
import {convertTabSchema} from "../Utils";

export const initialShExStatus = {
    shExActiveTab: API.defaultTab,
    shExTextArea: '',
    shExUrl: '',
    shExFormat: API.defaultShExFormat
};

export function shExParamsFromQueryParams(params) {
    let newParams = {};
    if (params.schema) newParams["schema"] = params.schema ;
    if (params.schemaFormat) newParams["schemaFormat"] = params.schemaFormat ;
    if (params.schemaUrl) newParams["schemaUrl"] = params.schemaUrl ;
    return newParams;
}

export function shExReducer(status,action) {
    switch (action.type) {
        case 'set-params':
            const value = action.value;
            if (value) {
                const activeTab = value.schema ? API.byTextTab : API.value.schemaUrl ? API.byUrlTab : status.shExActiveTab;
                const textArea = value.schema ? value.schema : status.shExTextArea;
                const url = value.schemaUrl? value.schemaUrl: status.shExUrl ;
                const format = value.schemaFormat? value.schemaFormat: status.shExFormat;
                return {...status, shExActiveTab: activeTab, shExTextArea: textArea, shExUrl: url, shExFormat: format};
            } else return status;
        case 'changeTab':
            return { ...status, shExActiveTab: action.value }
        case 'setText':
            return { ...status, shExActiveTab: API.byTextTab, shExTextArea: action.value }
        case 'setUrl':
            return { ...status, shExActiveTab: API.byUrlTab, shExUrl: action.value }
        case 'setFile':
            return { ...status, shExActiveTab: API.byFileTab, shExFile: action.value }
        case 'setFormat':
            return { ...status, shExFormat: action.value }
        default:
            return new Error(`shExReducer: unknown action type: ${action.type}`)
    }
}

export function paramsFromShEx(shExStatus) {
    let params = {};
    params['activeSchemaTab'] = convertTabSchema(shExStatus.shExActiveTab);
    params['schemaEmbedded'] = false;
    params['schemaFormat'] = shExStatus.shExFormat;
    switch (shExStatus.shExActiveTab) {
        case API.byTextTab:
            params['schema'] = shExStatus.shExTextArea;
            params['schemaFormatTextArea'] = shExStatus.shExFormat;
            break;
        case API.byUrlTab:
            params['schemaURL'] = shExStatus.shExUrl;
            params['schemaFormatUrl'] = shExStatus.shExFormat;
            break;
        case API.byFileTab:
            params['schemaFile'] = shExStatus.shExFile;
            params['schemaFormatFile'] = shExStatus.shExFormat;
            break;
        default:
    }
    console.log(`paramsShEx: ${JSON.stringify(params)}`)
    return params;
}
