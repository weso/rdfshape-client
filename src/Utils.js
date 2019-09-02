// import React from 'react';
import Viz from 'viz.js/viz.js';
import API from "./API";

const { Module, render } = require('viz.js/full.render.js');

function *intersperse(a, delim) {
    let first = true;
    for (const x of a) {
        if (!first) yield delim;
        first = false;
        yield x;
    }
}

export function dot2svg(dot,cb) {
    console.log("### Dot2SVG!!!" + dot);
    const digraph = 'digraph { a -> b; }';
    const viz = new Viz({ Module, render });
    const opts = {engine: 'dot'};
    viz.renderSVGElement(digraph, opts).then(function(svg) {
      console.log("SVG converted!!")
      console.log(svg);
      cb(svg);
    });
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
}

export function maybeAdd(maybe,name,obj) {
    if (maybe) obj[name] = maybe ;
    return obj;
}

export function dataParamsFromQueryParams(params) {
    let newParams = {};
    if (params.data) newParams["data"] = params.data ;
    if (params.dataFormat) newParams["dataFormat"] = params.dataFormat ;
    if (params.dataUrl) newParams["dataUrl"] = params.dataUrl ;
    return newParams;
}

export function shExParamsFromQueryParams(params) {
    let newParams = {};
    if (params.schema) newParams["schema"] = params.schema ;
    if (params.schemaFormat) newParams["schemaFormat"] = params.schemaFormat ;
    if (params.schemaUrl) newParams["schemaUrl"] = params.schemaUrl ;
    return newParams;
}

export function shapeMapParamsFromQueryParams(params) {
    let newParams = {};
    if (params.shapeMap) newParams["shapeMap"] = params.shapeMap ;
    if (params.shapeMapFormat) newParams["shapeMapFormat"] = params.shapeMapFormat ;
    if (params.shapeMapUrl) newParams["shapeMapUrl"] = params.shapeMapUrl ;
    return newParams;
}

export function endpointParamsFromQueryParams(params) {
    let newParams = {};
    if (params.endpoint) newParams["endpoint"] = params.endpoint ;
    return newParams;
}

export function paramsFromStateData(state) {
    const activeTab = state.dataActiveTab;
    const dataTextArea = state.dataTextArea;
    const dataFormat = state.dataFormat;
    const dataUrl = state.dataUrl;
    const dataFile = state.dataFile;
    let params = {}
    params['activeTab'] = convertTabData(activeTab);
    params['dataFormat'] = dataFormat;
    switch (activeTab) {
        case API.byTextTab:
            params['data'] = dataTextArea;
            params['dataFormatTextArea']=dataFormat;
            break;
        case API.byUrlTab:
            params['dataURL'] = dataUrl;
            params['dataFormatUrl']=dataFormat;
            break;
        case API.byFileTab:
            params['dataFile'] = dataFile;
            params['dataFormatFile']=dataFormat;
            break;
        default:
    }
   return params;
}

export function paramsFromStateEndpoint(state) {
    let params = {}
    params['endpoint'] = state.endpoint;
    return params;
};


export function paramsFromStateShEx(state) {
    const activeTab = state.shExActiveTab;
    const textArea = state.shExTextArea;
    const format = state.shExFormat;
    const url = state.shExUrl;
    const file = state.shExFile;
    let params = {}
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
};

export function paramsFromStateShapeMap(state) {
    const activeTab = state.shapeMapActiveTab;
    const textArea = state.shapeMapTextArea;
    const format = state.shapeMapFormat;
    const url = state.shapeMapUrl;
    const file = state.shapeMapFile;
    let params = {}
    params['shapeMapActiveTab'] = convertTabShapeMap(activeTab);
    params['shapeMapFormat'] = format;
    switch (activeTab) {
        case "byText":
            params['shapeMap'] = textArea;
            params['shapeMapFormatTextArea'] = format;
            break;
        case "byURL":
            params['shapeMapURL'] = url;
            params['shapeMapFormatURL'] = format;
            break;
        case "byFile":
            params['shapeMapFile'] = file;
            params['shapeMapFormatFile'] = format;
            break;
        default:
    }
    return params;
};

export function paramsFromStateQuery(state) {
    let params = {}
    let activeTab = state.queryActiveTab;
    params['activeTab'] = convertTabQuery(activeTab);
    switch (activeTab) {
        case "byText":
            params['query'] = state.queryTextArea;
            break;
        case "byURL":
            params['queryURL'] = state.queryUrl;
            break;
        case "byFile":
            params['queryFile'] = state.queryFile;
            break;
        default:
    }
    return params;
};

function convertTabData(key) {
    switch (key) {
        case API.byTextTab: return "#dataTextArea"
        case API.byFileTab: return "#dataFile"
        case API.byUrlTab: return "#dataUrl"
        default: console.log("Unknown schemaTab: " + key);
            return key
    }
}

export function convertTabSchema(key) {
    switch (key) {
        case API.byTextTab: return "#schemaTextArea"
        case API.byFileTab: return "#schemaFile"
        case API.byUrlTab: return "#schemaUrl"
        default: console.log("Unknown schemaTab: " + key);
            return key
    }
}

export function convertTabShapeMap(key) {
    switch (key) {
        case API.byTextTab: return "#shapeMapTextArea"
        case API.byFileTab: return "#shapeMapFile"
        case API.byUrlTab: return "#shapeMapUrl"
        default:
            console.log("Unknown schemaTab: " + key);
            return key
    }
}

export function convertTabQuery(key) {
    switch (key) {
        case API.byTextTab: return "#queryTextArea"
        case API.byFileTab: return "#queryFile"
        case API.byUrlTab: return "#queryUrl"
        default:
            console.log("Unknown schemaTab: " + key);
            return key
    }
}
