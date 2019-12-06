import API from '../API';
import {convertTabSchema} from "../Utils";

export const initialShapeMaptatus = {
    activeTab: API.defaultTab,
    textArea: '',
    url: '',
    file: null,
    format: API.defaultDataFormat
} ;

export function dataReducer(status,action) {
    switch (action.type) {
        case 'changeTab':
            return {
                ...status,
                activeTab: action.value
            }
        case 'setText':
            return {
                ...status,
                activeTab: API.byTextTab,
                textArea: action.value
            }
        case 'setUrl':
            return { ...status,
                activeTab: API.byUrlTab,
                url: action.value
            }
        case 'setFile':
            return {
                ...status,
                activeTab: API.byFileTab,
                file: action.value
            }
        case 'setFormat':
            return { ...status,
                format: action.value
            }
        default:
            return new Error(`dataReducer: unknown action type: ${action.type}`)
    }
}

export function paramsFromData(status) {
    let params = {};
    params['activeDataTab'] = convertTabSchema(status.activeTab);
    params['dataFormat'] = status.format;
    switch (status.activeTab) {
        case API.byTextTab:
            params['data'] = status.textArea;
            params['dataFormatTextArea'] = status.format;
            break;
        case API.byUrlTab:
            params['dataURL'] = status.url;
            params['dataFormatUrl'] = status.format;
            break;
        case API.byFileTab:
            params['dataFile'] = status.file;
            params['dataFormatFile'] = status.format;
            break;
        default:
    }
    return params;
}
