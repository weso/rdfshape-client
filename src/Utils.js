import React from 'react';
import {mkFormData} from "./Permalink";
import qs from "query-string";

function addPart(maybe, name) {
    if (maybe) return "&name=" + maybe
    else return '';
}

function *intersperse(a, delim) {
    let first = true;
    for (const x of a) {
        if (!first) yield delim;
        first = false;
        yield x;
    }
}

export function mkMode(format) {
    if (format) {
        switch (format.toLowerCase()) {
            case "turtle":
                return "turtle"
            case "html":
                return "xml"
            case "rdf/xml":
                return "xml"
            case "shex":
                return "turtle"
            case "sparql":
                return "sparql"
            case "rdf/json":
                return "javascript"
            case "shexj":
                return "javascript"
            default:
                return "xml"
        }
    } else return "xml"
};

export function maybeAdd(maybe,name,obj) {
    if (maybe) obj[name] = maybe ;
    return obj;
};

export function dataParamsFromQueryParams(params) {
    let newParams = {};
    if (params.data) newParams["data"] = params.data ;
    if (params.dataFormat) newParams["dataFormat"] = params.dataFormat ;
    if (params.dataUrl) newParams["dataUrl"] = params.dataUrl ;
    return newParams;
};

export function formDataFromState(state) {
    const dataTextArea = state.dataTextArea;
    const activeTab = state.activeTab;
    const dataFormat = state.dataFormat;
    const dataUrl = state.dataUrl;
    const dataFile = state.dataFile;
    let params = {};
    params['activeTab'] = activeTab;
    params['dataFormat']=dataFormat;
    switch (activeTab) {
        case "byText":
            params['data'] = dataTextArea;
            params['dataFormatTextArea']=dataFormat;
            break;
        case "byURL":
            params['dataURL'] = dataUrl;
            params['dataFormatUrl']=dataFormat;
            break;
        case "byFile":
            params['dataFile'] = dataFile;
            params['dataFormatFile']=dataFormat;
            break;
        default:
    }
    let formData = mkFormData(params);
    console.log("Form data created: " + JSON.stringify(formData));
   return [formData, params];
};

