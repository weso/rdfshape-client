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
      dataQuery: this.rootApi + "data/query",
      dataExtract: this.rootApi + "data/extract",
      dataFormatsInput: this.rootApi + "data/formats/input",
      dataFormatsOutput: this.rootApi + "data/formats/output",
      dataVisualFormats: this.rootApi + "data/formats/visual",

      schemaInfo: this.rootApi + "schema/info",
      schemaConvert: this.rootApi + "schema/convert",
      schemaValidate: this.rootApi + "schema/validate",
      shExFormats: this.rootApi + "schema/formats?schemaEngine=shex",
      shaclFormats: this.rootApi + "schema/formats?schemaEngine=shaclex",
      schemaShaclEngines: this.rootApi + "schema/engines/shacl",

      shapeMapInfo: this.rootApi + "shapemap/info",
      shapeMapFormats: this.rootApi + "shapemap/formats",

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
      dataVisualizeGraphvizRoute: "/dataVisualizeGraphviz",
      dataVisualizeGraphvizRouteRaw: "/dataVisualizeGraphvizRaw",
      dataVisualizeCytoscapeRoute: "/dataVisualizeCytoscape",
      dataVisualizeCytoscapeRouteRaw: "/dataVisualizeCytoscapeRaw",
      dataExtractRoute: "/dataExtract",
      dataMergeRoute: "/dataMerge",
      dataMergeVisualizeRoute: "/dataMergeVisualize",
      dataMergeVisualizeRouteRaw: "/dataMergeVisualizeRaw",
      dataQueryRoute: "/dataQuery",

      endpointInfoRoute: "/endpointInfo",
      endpointExtractRoute: "/endpointExtract",
      endpointQueryRoute: "/endpointQuery",

      shexInfoRoute: "/shexInfo",
      shexConvertRoute: "/shexConvert",
      shexVisualizeUmlRoute: "/shexVisualizeUml",
      shexVisualizeUmlRouteRaw: "/shexVisualizeUmlRaw",
      shex2ShaclRoute: "/shex2Shacl",
      shexValidateRoute: "/shexValidate",
      shexValidateEndpointRoute: "/shexValidateEndpoint",
      shex2XmiRoute: "/shex2Xmi",
      shapeFormRoute: "/shapeForm",

      shaclInfoRoute: "/shaclInfo",
      shaclConvertRoute: "/shaclConvert",
      shacl2ShExRoute: "/shacl2ShEx",
      shaclValidateRoute: "/shaclValidate",
      jenaShaclValidateRoute: "/jenaShaclValidate",

      shapeMapInfoRoute: "/shapeMapInfo",

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

  // Dictionary with the names used for query parameters
  // Centralized point to change them and keep them in sync with what the server expects
  static queryParameters = {
    data: {
      data: "data",
      source: "dataSource",
      format: "dataFormat",
      targetFormat: "dataTargetFormat",
      inference: "dataInference",
      compound: "dataCompound",
      nodeSelector: "nodeSelector",
      layout: "dataLayout", // Client only
    },
    schema: {
      schema: "schema",
      source: "schemaSource",
      format: "schemaFormat",
      engine: "schemaEngine",
      inference: "schemaInference",
      targetFormat: "schemaTargetFormat",
      targetEngine: "schemaTargetEngine",
      triggerMode: "triggerMode",
    },
    shapeMap: {
      shapeMap: "shapeMap",
      source: "shapeMapSource",
      format: "shapeMapFormat",
    },
    query: {
      query: "query",
      source: "querySource",
    },
    extraction: {
      endpoint: "endpoint",
      nodeSelector: "nodeSelector",
    },
    endpoint: {
      endpoint: "endpoint",
    },
    uml: {
      uml: "uml",
      source: "umlSource",
      format: "umlFormat",
    },
    permalink: {
      code: "urlCode",
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
    shex: "ShEx",
    visualization: "visualization",

    shaclValidationReportText: "shaclReportText",
    shaclValidationReportNodes: "shaclReportNodes",
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
    png: "PNG",
    html: "HTML",
    htmlMicrodata: "html-microdata",
    htmlRdf: "html-rdfa11",
    json: "JSON",
    jsonld: "JSON-LD",
    dot: "DOT",
    ps: "PS",
    uml: "UML",
    txt: "txt",

    defaultData: "turtle",
    defaultShex: "ShExC",
    defaultShacl: "turtle",
    defaultShapeMap: "Compact",
    defaultQuery: "SPARQL",
    defaultGraphical: "SVG",
  };

  // Mime types
  static mimeTypes = {
    shex: "text/shex",
    svg: "image/svg+xml",
    png: "image/png",
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
    defaultShacl: "SHACLex",

    shex: "ShEx",
    shaclex: "SHACLex",
    jenaShacl: "JenaSHACL",
    shacl_tq: "SHACL_TQ",
    xml: "xml",
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
    navbarHeaders: {
      rdf: "RDF",
      endpoint: "Endpoint",
      shex: "ShEx",
      shacl: "SHACL",
      shapeMap: "ShapeMap",
      analysis: "Analysis",
      information: "Information",
      conversion: "Conversion",
      visualization: "Visualization",
      validationUser: "Validation (user data)",
      validationEndpoint: "Validation (endpoint data)",
      mergeAndConvert: "Merge & Convert",
      mergeAndVisualize: "Merge & Visualize",
      sparqlQuery: "Query (SPARQL)",
      shexExtract: "ShEx extraction",
      shexToShacl: "ShEx → SHACL",
      shaclToShex: "SHACL → ShEx",
      shexToForm: "ShEx → Form",
      shexToUml: "ShEx ⟷ UML",
      examples: "Examples",
      help: "Help",
      wikishape: "Wikishape",
      wiki: "Wiki",
      apiDocs: "API Docs",
      about: "About",
    },

    pageHeaders: {
      dataInfo: "Data analysis",
      dataConversion: "Data conversion",
      dataVisualization: "Data visualization",
      dataMergeConvert: "Data merge & convert",
      dataMergeVisualize: "Data merge & visualize",
      dataQuery: "Data query",
      wikidataQuery: "Query Wikidata",
      wikidataValidate: "Validate Wikidata entities",
      dataShexExtraction: "Extract ShEx from Data",
      wikidataSchemaExtraction: "Extract schema from Wikidata entities",
      endpointSchemaExtraction: "Extract schema from Endpoint node",

      endpointInfo: "Endpoint information",
      endpointQuery: "Endpoint query",

      shexInfo: "ShEx analysis",
      shexConversion: "ShEx conversion",
      shexValidation: "ShEx validate user data",
      shexValidationEndpoint: "ShEx validate endpoint data",
      shexVisualization: "ShEx visualization",
      shexToShacl: "ShEx conversion to Shacl",
      shexToForm: "Create form from ShEx",
      shexToUml: "ShEx conversion to UML",
      umlToShex: "UML conversion to ShEx",

      shaclInfo: "SHACL analysis",
      shaclValidation: "SHACL validate user data",
      shaclConversion: "SHACL conversion",
      shaclToShex: "SHACL conversion to ShEx",

      shapeMapInfo: "ShapeMap analysis",
    },

    dataTabs: {
      dataHeader: "Data (RDF)",
      shexHeader: "Shapes Graph (ShEx)",
      shaclHeader: "Shapes Graph (SHACL)",
      shapeMapHeader: "ShapeMap",
      queryHeader: "Query (SPARQL)",
      umlHeader: "UML (XMI)",

      formatHeader: "Format",
    },

    endpoints: {
      commonEndpoints: "Common endpoints",
      online: "Endpoint ONLINE",
    },

    xmi: {
      umlToShex: "Load UML to ShEx converter",
      shexToUml: "Load ShEx to UML converter",
    },

    placeholders: {
      sparqlQuery: "SELECT...",
      rdf: "RDF...",
      url: "http://...",
      shex: "ShEx...",
      shacl: "SHACL...",
      shapeMap: "<node>@<Shape>...>",
      xmi: "XMI...",
    },

    actionButtons: {
      analyze: "Analyze",
      convert: "Convert",
      visualize: "Visualize",
      validate: "Validate",
      merge: "Merge",
      query: "Query",
      extract: "Extract",
      fetch: "Fetch",
      createForm: "Create form",
    },

    validationResults: {
      allValid: "Validation successful",
      nodeValid: "Valid",
      nodeInvalid: "Invalid",
      someValid:
        "Partially invalid data: check the details of each node to learn more",
      noneValid: "Invalid data: check the details of each node to learn more",
      noData:
        "Validation was completed but no results were obtained, check if the input data is coherent",
    },

    misc: {
      shex: "ShEx",
      xmi: "XMI",
      graph: "Graph",
      prefixMap: "Prefix map",
      associations: "Associations",
      umlDiagram: "UML Diagram",
      fullscreen: "Fullscreen",
      download: "Download",

      shaclValidationReportText: "Validation report",
      shaclValidationReportNodes: "Results per node",
    },

    networkError: "Network error",
    errorParsingUrl: "Could not parse URL information",
    noProvidedRdf: "No RDF data provided",
    noProvidedSchema: "No schema provided",
    invalidXmiSchema: "Invalid XMI schema",
    noProvidedShapeMap: "No shapeMap provided",
    noProvidedQuery: "No query provided",
    noProvidedEndpoint: "No endpoint provided",
    noProvidedUml: "No UML provided",
    errorResponsePrefix: "Error response",
    responseSummaryText: "Full response",
    noPrefixes: "No prefixes",
    noAssociations: "No associations",

    dataFormat: "Data format",
    schemaFormat: "Schema format",
    schemaEngine: "Schema engine",
    shapeMapFormat: "ShapeMap format",

    numberOfStatements: "Number of statements",
    numberOfShapes: "Number of shapes",
    numberOfAssociations: "Number of associations",

    operationInformation: "Operation information",
    visualizationsWillAppearHere: "Visualizations will appear here",
    dataInfoWillAppearHere: "Data info will appear here",
    schemaInfoWillAppearHere: "Schema info will appear here",
    conversionResultsWillAppearHere: "Conversion results will appear here",
    extractionResultsWillAppearHere: "Extraction results will appear here",
    mergeResultsWillAppearHere: "Merge results will appear here",
    queryResultsWillAppearHere: "Query results will appear here",
    validationResultsWillAppearHere: "Validation results will appear here",
    noPermalinkManual:
      "Can't generate links for long manual inputs, try inserting data by URL",
    noPermalinkFile:
      "Can't generate links for file-based inputs, try inserting data by URL",
    embeddedLink: "Embedded link",
    permalinkCopied: "Link copied to clipboard!",
    shapeStartRequired: '"Shape Start" is required on input',

    enableFullscreen: "Show at fullscreen",
    leaveFullscreen: "✖ Leave fullscreen",
  };
}

export default API;
