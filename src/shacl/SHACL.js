import API from '../API';
import {convertTabSchema} from "../Utils";

export const initialSHACLStatus = {
    shaclActiveTab: API.defaultTab,
    shaclTextArea: '',
    shaclUrl: '',
    shaclFormat: API.defaultSHACLFormat
} ;

export function shaclReducer(status,action) {
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
}

export function paramsFromShacl(status) {
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
}
