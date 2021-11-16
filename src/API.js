/** This class contains global definitions */

import environmentConfiguration from "./EnvironmentConfig";

class API {
  // Routes
  static rootApi = environmentConfiguration.apiHost + "/api/";
  static routes = {
    // Routes in server
    server: {
      root: this.rootApi,
      health: this.rootApi + "health",

      dataInfo: this.rootApi + "data/info",
      dataConvert: this.rootApi + "data/convert",
      dataVisualize: this.rootApi + "data/visualize",
      dataQuery: this.rootApi + "data/query",
      dataExtract: this.rootApi + "data/extract",
      dataFormatsInput: this.rootApi + "data/formats/input",
      dataFormatsOutput: this.rootApi + "data/formats/output",
      dataVisualFormats: this.rootApi + "data/formats/visual",

      shExFormats: this.rootApi + "schema/formats?schemaEngine=shex",
      shaclFormats: this.rootApi + "schema/formats?schemaEngine=shaclex",
      schemaValidate: this.rootApi + "schema/validate",
      schemaInfo: this.rootApi + "schema/info",
      schemaVisualize: this.rootApi + "schema/visualize",
      schemaConvert: this.rootApi + "schema/convert",
      schemaVisualizeCytoscape: this.rootApi + "schema/cytoscape",
      schemaSHACLEngines: this.rootApi + "schema/engines/shacl",

      shapemapInfo: this.rootApi + "shapemap/info",
      shapemapFormats: this.rootApi + "shapemap/formats",

      endpointInfo: this.rootApi + "endpoint/info",
      endpointQuery: this.rootApi + "endpoint/query",

      inferenceEngines: this.rootApi + "data/inferenceEngines",

      serverPermalinkEndpoint: this.rootApi + "permalink/generate",
      serverOriginalLinkEndpoint: this.rootApi + "permalink/get",
      fetchUrl: this.rootApi + "fetch",

      wikidataEntityLabel: this.rootApi + "wikidata/entityLabel",
      wikidataSearchEntity: this.rootApi + "wikidata/searchEntity",
      wikidataLanguages: this.rootApi + "wikidata/languages",
      wikidataSchemaContent: this.rootApi + "wikidata/schemaContent",
    },
    // Routes in client
    client: {
      dataInfoRoute: "/dataInfo",
      dataConvertRoute: "/dataConvert",
      dataVisualizeRoute: "/dataVisualize",
      dataVisualizeRouteRaw: "/dataVisualizeRaw",
      cytoVisualizeRoute: "/dataVisualizeCyto",
      cytoVisualizeRouteRaw: "/dataVisualizeCytoRaw",
      dataExtractRoute: "/dataExtract",
      dataMergeRoute: "/dataMerge",
      dataMergeVisualizeRoute: "/dataMergeVisualize",
      dataMergeVisualizeRouteRaw: "/dataMergeVisualizeRaw",
      dataQueryRoute: "/dataQuery",

      endpointInfoRoute: "/endpointInfo",
      endpointExtractRoute: "/endpointExtract",
      endpointQueryRoute: "/endpointQuery",

      shExInfoRoute: "/shExInfo",
      shExConvertRoute: "/shExConvert",
      shExVisualizeRoute: "/shExVisualize",
      shExVisualizeRouteRaw: "/shExVisualizeRaw",
      shExVisualizeCytoscapeRoute: "/shExVisualizeCytoscape",
      shEx2ShaclRoute: "/shEx2Shacl",
      shExValidateRoute: "/shExValidate",
      shExValidateEndpointRoute: "/shExValidateEndpoint",
      shEx2XMIRoute: "/shEx2XMI",
      shapeFormRoute: "/shapeForm",

      shaclInfoRoute: "/shaclInfo",
      shaclConvertRoute: "/shaclConvert",
      shacl2ShExRoute: "/shacl2ShEx",
      shaclValidateRoute: "/shaclValidate",
      jenaShaclValidateRoute: "/jenaShaclValidate",

      shapemapInfoRoute: "/shapemapInfo",

      wikidataQueryRoute: "/wikidataQuery",
      wikidataValidateRoute: "/wikidataValidate",
      wikidataExtractRoute: "/wikTURTLEidataExtract",

      permalinkRoute: "/link/:urlCode",

      aboutRoute: "/about",
    },
    // Other useful routes
    utils: {
      wikidataUrl: "https://query.wikidata.org/sparql",
      dbpediaUrl: "https://dbpedia.org/sparql",
      testInputTabsWithFormatRoute: "/test/inputTabsWithFormat",
    },
  };

  // Information sources / tabs
  static sources = {
    byText: "byText",
    byUrl: "byUrl",
    byFile: "byFile",
    bySchema: "bySchema",

    default: "byText",
  };

  static tabs = {
    xmi: "XMI",
    uml: "UML",
  };

  // Formats (most formats come from server but we need defaults for data initialization)
  static formats = {
    turtle: "turtle",
    triG: "TriG",
    compact: "Compact",
    shexc: "ShExC",
    shexj: "ShExJ",
    sparql: "SPARQL",
    xml: "XML",
    rdfXml: "RDF/XML",
    rdfJson: "RDF/JSON",
    svg: "SVG",
    html: "HTML",
    htmlMicrodata: "html-microdata",
    htmlRdf: "html-rdfa11",
    json: "JSON",
    jsonld: "JSON-LD",

    defaultData: "turtle",
    defaultShex: "ShExC",
    defaultShacl: "turtle",
    defaultShacl: "turtle",
    defaultShapeMap: "Compact",
    defaultQuery: "SPARQL",
    defaultGraphical: "SVG",
  };

  // Inferences
  static inferences = {
    default: "None",

    none: "None",
  };

  // Engines
  static engines = {
    default: "ShEx",
    defaultShex: "ShEx",
    defaultShacl: "JenaSHACL",

    shex: "ShEx",
    jenaShacl: "JenaSHACL",
  };

  // Trigger modes
  static triggerModes = {
    default: "shapeMap",

    shapeMap: "shapeMap",
    targetDecls: "targetDecls",
  };

  // By text limitations
  static limits = {
    byTextCharacterLimit: 2200,
  };

  // Text constants
  static texts = {
    errorResponsePrefix: "Error response",
    responseSummaryText: "Full response",
    noPrefixes: "No prefixes",
  };
}

export default API;
