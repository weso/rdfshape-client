import React from "react";
import { ExternalLinkIcon } from "react-open-iconic-svg";
import { Slide } from "react-toastify";
import Viz from "viz.js/viz.js";
import API from "../API";

const { Module, render } = require("viz.js/full.render.js");

export function dot2svg(dot, cb) {
  const digraph = "digraph { a -> b; }";
  const viz = new Viz({ Module, render });
  const opts = { engine: "dot" };
  viz.renderSVGElement(digraph, opts).then(function(svg) {
    cb(svg);
  });
}

/**
 * Converts Turtle representation of values to a structure
 * @param node
 * @param prefixMap
 * @returns {{str: string,
    localName: string: Local name,
    node: *,
    prefix: string,
    type: string,
    uri: any
 }}
 */
export function showQualify(node, prefixMap) {
  if (node) {
    const relativeBaseRegex = /^<internal:\/\/base\/(.*)>$/g;
    const matchBase = relativeBaseRegex.exec(node);
    if (matchBase) {
      const rawNode = matchBase[1];
      return {
        type: "RelativeIRI",
        uri: rawNode,
        str: `<${rawNode}>`,
        prefix: "",
        localName: "",
        node: node,
      };
    } else {
      const iriRegexp = /^<(.*)>$/g;
      const matchIri = iriRegexp.exec(node);
      if (matchIri) {
        const rawNode = matchIri[1];
        for (const key in prefixMap) {
          if (rawNode.startsWith(prefixMap[key])) {
            const localName = rawNode.slice(prefixMap[key].length);
            return {
              type: "QualifiedName",
              uri: rawNode,
              prefix: key,
              localName: localName,
              str: `${key}:${localName}`,
              node: node,
            };
          }
        }
        return {
          type: "FullIRI",
          uri: rawNode,
          prefix: "",
          localName: "",
          str: `<${rawNode}>`,
          node: node,
        };
      }
      // const matchString =
      const datatypeLiteralRegex = /"(.*)"\^\^(.*)/g;
      const matchDatatypeLiteral = datatypeLiteralRegex.exec(node);
      if (matchDatatypeLiteral) {
        const literal = matchDatatypeLiteral[1];
        const datatype = matchDatatypeLiteral[2];
        const datatypeQualified = showQualify(datatype, prefixMap);
        const datatypeElement = showQualified(datatypeQualified, prefixMap);
        return {
          type: "DatatypeLiteral",
          prefix: "",
          localName: "",
          str: `"${literal}"`,
          datatype: datatype,
          datatypeElement: datatypeElement,
          node: node,
        };
      }
      const langLiteralRegex = /"(.*)"@(.*)/g;
      const matchLangLiteral = langLiteralRegex.exec(node);
      if (matchLangLiteral) {
        const literal = matchLangLiteral[1];
        const lang = matchLangLiteral[2];
        return {
          type: "LangLiteral",
          prefix: "",
          localName: "",
          str: `"${literal}"@${lang}`,
          datatype: null,
          node: node,
        };
      }
      const literalRegex = /"(.*)"/g;
      const matchLiteral = literalRegex.exec(node);
      if (matchLiteral)
        return {
          type: "Literal",
          prefix: "",
          localName: "",
          str: node,
          datatype: null,
          node: node,
        };
      if (node.type === "bnode")
        return {
          type: "BNode",
          prefix: "",
          localName: node.value,
          str: `_:${node.value}`,
          node: node,
        };
      console.warn(
        `ShowQualify: Unknown format for node: ${JSON.stringify(node)}`
      );
      return {
        type: "Unknown",
        prefix: "",
        localName: "",
        str: node,
        datatype: null,
        node: node,
      };
    }
  } else {
    return {
      type: "empty",
      prefix: "",
      localName: "",
      str: "",
      node: node,
    };
  }
}

export function showQualified(qualified, prefixes) {
  // Strip quotes for display
  if (qualified.str)
    qualified.str = qualified.str.replace(/^"/, "").replace(/"$/, "");

  switch (qualified.type) {
    case "RelativeIRI":
      return <span>{qualified.str}</span>;
    case "QualifiedName":
      if (prefixes.includes(qualified.prefix)) {
        return (
          <>
            <a
              href={
                API.wikidataOutgoingRoute +
                "?node=" +
                encodeURIComponent(qualified.uri)
              }
            >
              {qualified.str}
            </a>
            <a href={qualified.uri}>
              <ExternalLinkIcon />
            </a>
          </>
        );
      } else {
        return (
          <>
            {qualified.str}{" "}
            <a href={qualified.uri}>
              <ExternalLinkIcon />
            </a>
          </>
        );
      }
    case "FullIRI":
      return <a href={qualified.uri}>{qualified.str}</a>;
    case "DatatypeLiteral":
      return (
        <span>
          {qualified.str}^^
          <a href={qualified.datatype}>&lt;{qualified.datatype}&gt;</a>
        </span>
      );
    case "Literal":
      return <span>{qualified.str}</span>;
    case "LangLiteral":
      return <span>{qualified.str}</span>;
    default:
      console.error(`Unknown type for qualified value`);
      return <span>{qualified.str}</span>;
  }
}

export function paramsFromStateEndpoint(state) {
  return { [API.queryParameters.endpoint.endpoint]: state.endpoint };
}

export const notificationSettings = {
  permalinkText: API.texts.permalinkCopied,
  position: "bottom-right",
  autoCCytoscapeComponentlose: 2500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  pauseOnHover: true,
  closeButton: false,
  transition: Slide,
  limit: 1,
};

export function format2mode(format) {
  switch (format?.toLowerCase()) {
    case API.formats.turtle.toLowerCase():
      return API.formats.turtle;
    case API.formats.xml.toLowerCase():
    case API.formats.rdfXml.toLowerCase():
    case API.formats.triG.toLowerCase():
      return API.formats.xml;
    case API.formats.sparql.toLowerCase():
      return API.formats.sparql;
    case API.formats.json.toLowerCase():
    case API.formats.jsonld.toLowerCase():
    case API.formats.rdfJson.toLowerCase():
    case API.formats.shexj.toLowerCase():
      return API.formats.javascript;
    case API.formats.shexc.toLowerCase():
      return API.formats.shexc;
    case API.formats.html.toLowerCase():
    case API.formats.htmlMicrodata.toLowerCase():
    case API.formats.htmlRdf.toLowerCase():
      return API.formats.htmlMixed;
    default:
      return defaultMode;
  }
}
const defaultMode = API.formats.turtle.toLowerCase();

// Function generating the symbol for ordering data in a table
export const sortCaretGen = (order) => (
  <button className="discrete">{order === "desc" ? "↓" : "↑"}</button>
);
// Prefixes for prefix map tables
export const prefixMapTableColumns = [
  {
    dataField: "prefixName",
    text: "Name",
    sort: true,
    sortCaret: sortCaretGen,
  },
  {
    dataField: "prefixIRI",
    text: "IRI",
  },
];

// Prefixes for association tables (shapeMaps)
export const associationTableColumns = [
  {
    dataField: "node",
    text: "Node",
  },
  {
    dataField: "shape",
    text: "Shape",
  },
];

export const equalsIgnoreCase = (str1, str2, exact = false) => {
  return exact
    ? str1.toLowerCase() === str2.toLowerCase()
    : str1.toLowerCase() == str2.toLowerCase();
};

export const capitalize = (str) => {
  if (!str?.length) return;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Shorthand for scrolling items into view
export const scrollToItem = (
  element,
  config = {
    behavior: "smooth",
    block: "start",
  }
) => {
  element.scrollIntoView(config);
};

// Zoom limits for non-cyto visualizations, whose zoom is controlled with CSS
export const visualizationMinZoom = 0.2;
export const visualizationMaxZoom = 1.9;
export const visualizationStepZoom = 0.1;

// Function for reading Files from the client and extracting their text contents
export const getFileContents = async (file) =>
  await new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.readAsText(file);
  });

// Shortcut to all the settings that must be included in a Yashe object to prevent buttons
export const yasheNoButtonsOptions = {
  showTooltip: false,
  showUploadButton: false,
  showDownloadButton: false,
  showCopyButton: false,
  showDeleteButton: false,
  showShareButton: false,
  showThemeButton: false,
  showFullScreenButton: false,
};

// Shortcut to all the settings that must be included in a Yashe object to show minimal buttons
export const yasheMinButtonsOptions = {
  showUploadButton: false,
  showDeleteButton: false,
  showShareButton: false,
  showThemeButton: false,

  showTooltip: true,
  showDownloadButton: true,
  showCopyButton: true,
  showFullScreenButton: true,
};

// Shortcut to all the settings that must be included in a Yashe object used for results: copy and download
export const yasheResultButtonsOptions = {
  showUploadButton: false,
  showDeleteButton: false,
  showShareButton: false,
  showThemeButton: false,
  showTooltip: false,

  showDownloadButton: true,
  showCopyButton: true,
  showFullScreenButton: true,
};

// Create a random int in range min (inclusive) to max (exclusive)
export const randomInt = (min = 0, max = 1000) =>
  Math.floor(Math.random() * (max - min)) + min;

// Smoothly scroll to the element with the given id (if it exists)
export const scrollToElementById = (
  id = API.resultsId,
  options = {
    behavior: "smooth",
    block: "start",
  }
) => {
  const targetElement = document.getElementById(id);
  targetElement && targetElement.scrollIntoView(options);
};

export const scrollToResults = (options) =>
  scrollToElementById(API.resultsId, options || undefined);
