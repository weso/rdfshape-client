
/** This class contains global definitions */
// TODO: Global definitions in React could better be deined using Contexts?
class API {

    // Routes in server
    static rootApi = process.env.REACT_APP_RDFSHAPE_HOST + "/api/"; // "http://localhost:8080/api/";

    static dataInfo = API.rootApi + "data/info";
    static dataConvert = API.rootApi + "data/convert";
    static dataVisualize = API.rootApi + "data/visualize";
    static dataFormats = API.rootApi + "data/formats";
    static inferenceEngines = API.rootApi + "data/inferenceEngines";
    static dataQuery = API.rootApi + "data/query";
    static dataExtract = API.rootApi + "data/extract";
    static dataVisualFormats = API.rootApi + "data/visualize/formats";
    static endpointInfo = API.rootApi + "endpoint/info";
    static endpointQuery = API.rootApi + "endpoint/query";
    static shExFormats = API.rootApi + "schema/formats?schemaEngine=shex";
    static shapeMapInfo = API.rootApi + "shapeMap/info";
    static shapeMapFormats = API.rootApi + "shapeMap/formats";
    static shaclFormats = API.rootApi + "schema/formats?schemaEngine=shaclex";
    static schemaValidate = API.rootApi + "schema/validate";
    static schemaInfo = API.rootApi + "schema/info";
    static schemaVisualize = API.rootApi + "schema/visualize";
    static schemaConvert = API.rootApi + "schema/convert";
    static schemaVisualizeCytoscape = API.rootApi + "schema/cytoscape";

    static wikidataEntityLabel = API.rootApi + "wikidata/entityLabel";
    static wikidataSearchEntity = API.rootApi + "wikidata/searchEntity";
    static wikidataLanguages = API.rootApi + "wikidata/languages";
    static wikidataSchemaContent = API.rootApi + "wikidata/schemaContent";

    // Routes in client
    static dataInfoRoute = "/dataInfo";
    static dataConvertRoute = "/dataConvert";
    static dataVisualizeRoute = "/dataVisualize";
    static cytoVisualizeRoute = "/cytoVisualize";
    static dataExtractRoute = "/dataExtract";
    static dataQueryRoute = "/dataQuery";

    static endpointInfoRoute = "/endpointInfo";
    static endpointExtractRoute = "/endpointExtract";
    static endpointQueryRoute = "/endpointQuery";

    static shExInfoRoute = "/shExInfo";
    static shExConvertRoute = "/shExConvert";
    static shExVisualizeRoute = "/shExVisualize";
    static shExVisualizeCytoscapeRoute = "/shExVisualizeCytoscape";
    static shEx2ShaclRoute = "/shEx2Shacl";
    static shExValidateRoute = "/shExValidate";
    static shExValidateEndpointRoute = "/shExValidateEndpoint";

    static shaclInfoRoute = "/shaclInfo";
    static shaclConvertRoute = "/shaclConvert";
    static shacl2ShExRoute = "/shacl2ShEx";
    static shaclValidateRoute = "/shaclValidate";

    static shapeMapInfoRoute = "/shapeMapInfo";

    static wikidataQueryRoute = "/wikidataQuery";
    static wikidataValidateRoute = "/wikidataValidate";
    static wikidataExtractRoute = "/wikidataExtract";

    static aboutRoute = "/about";

    static byTextTab = "byText";
    static byUrlTab = "byUrl";
    static byFileTab = "byFile";
    static defaultTab = "byText";
    static defaultDataFormat = "TURTLE";
    static defaultInference = "None" ;
    static defaultShExFormat = "ShExC";
    static defaultSHACLFormat = "TURTLE";
    static defaultShapeMapFormat = "Compact";
    static defaultQueryFormat = "SPARQL";


    static wikidataUrl =  "https://query.wikidata.org/sparql" ;
    static dbpediaUrl = "https://dbpedia.org/sparql" ;

    static testInputTabsWithFormatRoute = "/test/inputTabsWithFormat"

}

export default API;
