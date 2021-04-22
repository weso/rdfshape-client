/** This class contains global definitions */

import environmentConfiguration from "./EnvironmentConfig";


class API {
  // Routes in server
  static rootApi = environmentConfiguration.apiHost + "/api/"; // "http(s)://localhost:8080/api/";

  static healthServer = API.rootApi + "health";
  static dataInfo = API.rootApi + "data/info";
  static dataConvert = API.rootApi + "data/convert";
  static dataVisualize = API.rootApi + "data/visualize";
  static dataFormatsInput = API.rootApi + "data/formats/input";
  static dataFormatsOutput = API.rootApi + "data/formats/output";
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
  static schemaSHACLEngines = API.rootApi + "schema/engines/shacl";

  static wikidataEntityLabel = API.rootApi + "wikidata/entityLabel";
  static wikidataSearchEntity = API.rootApi + "wikidata/searchEntity";
  static wikidataLanguages = API.rootApi + "wikidata/languages";
  static wikidataSchemaContent = API.rootApi + "wikidata/schemaContent";

  // Routes in client
  static dataInfoRoute = "/dataInfo";
  static dataConvertRoute = "/dataConvert";
  static dataVisualizeRoute = "/dataVisualize";
  static dataVisualizeRouteRaw = "/dataVisualizeRaw";
  static cytoVisualizeRoute = "/cytoVisualize";
  static cytoVisualizeRouteRaw = "/cytoVisualizeRaw";
  static dataExtractRoute = "/dataExtract";
  static dataMergeRoute = "/dataMerge";
  static dataMergeVisualizeRoute = "/dataMergeVisualize";
  static dataMergeVisualizeRouteRaw = "/dataMergeVisualizeRaw";
  static dataQueryRoute = "/dataQuery";

  static endpointInfoRoute = "/endpointInfo";
  static endpointExtractRoute = "/endpointExtract";
  static endpointQueryRoute = "/endpointQuery";

  static shExInfoRoute = "/shExInfo";
  static shExConvertRoute = "/shExConvert";
  static shExVisualizeRoute = "/shExVisualize";
  static shExVisualizeRouteRaw = "/shExVisualizeRaw";
  static shExVisualizeCytoscapeRoute = "/shExVisualizeCytoscape";
  static shEx2ShaclRoute = "/shEx2Shacl";
  static shExValidateRoute = "/shExValidate";
  static shExValidateEndpointRoute = "/shExValidateEndpoint";
  static shEx2XMIRoute = "/shEx2XMI";
  static shapeFormRoute = "/shapeForm";

  static shaclInfoRoute = "/shaclInfo";
  static shaclConvertRoute = "/shaclConvert";
  static shacl2ShExRoute = "/shacl2ShEx";
  static shaclValidateRoute = "/shaclValidate";
  static jenaShaclValidateRoute = "/jenaShaclValidate";

  static shapeMapInfoRoute = "/shapeMapInfo";

  static wikidataQueryRoute = "/wikidataQuery";
  static wikidataValidateRoute = "/wikidataValidate";
  static wikidataExtractRoute = "/wikTURTLEidataExtract";

  static aboutRoute = "/about";

  static permalinkRoute = "/link/:urlCode";

  static byTextTab = "byText";
  static byUrlTab = "byUrl";
  static byFileTab = "byFile";
  static xmiTab = "XMI";
  static umlTab = "UML";
  static defaultTab = "byText";
  static defaultDataFormat = "TURTLE";
  static turtleDataFormat = "TURTLE";
  static defaultInference = "None";
  static defaultShExFormat = "ShExC";
  static shexcDataFormat = "SHEXC";
  static defaultSHACLFormat = "TURTLE";
  static defaultSHACLEngine = "JenaSHACL";
  static defaultShapeMapFormat = "Compact";
  static defaultQueryFormat = "SPARQL";
  static defaultXMLFormat = "xml";

  static serverPermalinkEndpoint = API.rootApi + "permalink/generate";
  static serverOriginalLinkEndpoint = API.rootApi + "permalink/get";
  static fetchUrl = API.rootApi + "fetch";

  static wikidataUrl = "https://query.wikidata.org/sparql";
  static dbpediaUrl = "https://dbpedia.org/sparql";

  static testInputTabsWithFormatRoute = "/test/inputTabsWithFormat";

  // By text limitations
  static byTextCharacterLimit = 2200;
}

export default API;
