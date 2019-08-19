class API {
    static rootApi = "http://localhost:8080/api/";

    static dataInfo =           API.rootApi + "data/info" ;
    static dataConvert =        API.rootApi + "data/convert";
    static dataVisualize =      API.rootApi + "data/visualize";
    static dataFormats =        API.rootApi + "data/formats";
    static dataQuery =          API.rootApi + "data/query";
    static dataExtract =        API.rootApi + "data/extract";
    static dataVisualFormats =  API.rootApi + "data/visualize/formats";
    static endpointQuery =      API.rootApi + "endpoint/query";
    static shExFormats =        API.rootApi + "shex/formats";
    static shapeMapFormats =    API.rootApi + "shapeMap/formats";
    static schemaValidate =     API.rootApi + "schema/validate";

    static dataInfoRoute        = "/dataInfo" ;
    static dataConvertRoute     = "/dataConvert" ;
    static dataVisualizeRoute   = "/dataVisualize" ;
    static cytoVisualizeRoute   = "/cytoVisualize" ;
    static dataExtractRoute     = "/dataExtract" ;
    static dataQueryRoute       = "/dataQuery" ;

    static endpointInfoRoute        = "/endpointInfo" ;
    static endpointExtractRoute     = "/endpointExtract" ;
    static endpointQueryRoute       = "/endpointQuery" ;

    static shExInfoRoute        = "/shExInfo" ;
    static shExConvertRoute     = "/shExConvert" ;
    static shExVisualizeRoute   = "/shExVisualize" ;
    static shEx2ShaclRoute      = "/shEx2Shacl" ;
    static shExValidateRoute    = "/shExValidate" ;

    static shaclInfoRoute       = "/shaclInfo" ;
    static shaclConvertRoute    = "/shaclConvert" ;
    static shacl2ShExRoute      = "/shacl2ShEx" ;
    static shaclValidateRoute   = "/shaclValidate" ;

    static wikidataQueryRoute    = "/wikidataQuery" ;
    static wikidataValidateRoute = "/wikidataValidate" ;
    static wikidataExtractRoute  = "/wikidataExtract" ;

    static aboutRoute           = "/about" ;

}

export default API;
