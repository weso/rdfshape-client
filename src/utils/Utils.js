// import React from 'react';
import Viz from 'viz.js/viz.js';
import React, {Fragment} from "react";
import API from "../API";
import {ExternalLinkIcon} from "react-open-iconic-svg";

const { Module, render } = require('viz.js/full.render.js');

/*
function *intersperse(a, delim) {
    let first = true;
    for (const x of a) {
        if (!first) yield delim;
        first = false;
        yield x;
    }
}*/

export function dot2svg(dot,cb) {
    // console.log("### Dot2SVG!!!" + dot);
    const digraph = 'digraph { a -> b; }';
    const viz = new Viz({ Module, render });
    const opts = {engine: 'dot'};
    viz.renderSVGElement(digraph, opts).then(function(svg) {
      // console.log("SVG converted!!");
      // console.log(svg);
      cb(svg);
    });
}

const formatModes = {
    "html": "html",
    "json": "javascript",
    "rdf/json": "javascript",
    "rdf/xml": "xml",
    "shexc": "shex",
    "shexj": "javascript",
    "trig": "xml",
    "turtle": "turtle",
    "sparql": "sparql",
  };

const defaultMode = "xml";

export function mkMode(format) {
    let mode = format ? formatModes[format.toLowerCase()] || defaultMode: defaultMode;
    // console.log(`mkMode(${format}) = ${mode}`);
    return mode; 
}

/*export function maybeAdd(maybe,name,obj) {
    if (maybe) obj[name] = maybe ;
    return obj;
}*/

export function dataParamsFromQueryParams(params) {
    // This code is redundant, it could be just return params
    // We keep it because we could do some error checking
    let newParams = {};
    if (params.data) newParams["data"] = params.data ;
    if (params.dataFormat) newParams["dataFormat"] = params.dataFormat ;
    if (params.dataUrl) newParams["dataUrl"] = params.dataUrl ;
    return newParams;
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
 }
 */
export function showQualify(node, prefixMap) {
    // console.log(`node: ${JSON.stringify(node)}`)
    if (node) {
        const relativeBaseRegex = /^<internal:\/\/base\/(.*)>$/g;
        const matchBase = relativeBaseRegex.exec(node);
        if (matchBase) {
            const rawNode = matchBase[1];
            return {
                type: 'RelativeIRI',
                uri: rawNode,
                str: `<${rawNode}>`,
                prefix: '',
                localName: '',
                node: node
            }
        } else {
            const iriRegexp = /^<(.*)>$/g;
            const matchIri = iriRegexp.exec(node);
            if (matchIri) {
                const rawNode = matchIri[1];
                for (const key in prefixMap) {
                    if (rawNode.startsWith(prefixMap[key])) {
                        const localName = rawNode.slice(prefixMap[key].length);
                        return {
                            type: 'QualifiedName',
                            uri: rawNode,
                            prefix: key,
                            localName: localName,
                            str: `${key}:${localName}`,
                            node: node
                        };
                    }
                }
                return {
                    type: 'FullIRI',
                    uri: rawNode,
                    prefix: '',
                    localName: '',
                    str: `<${rawNode}>`,
                    node: node
                };
            }
            // const matchString =
            const datatypeLiteralRegex = /\"(.*)\"\^\^(.*)/g
            const matchDatatypeLiteral = datatypeLiteralRegex.exec(node);
            if (matchDatatypeLiteral) {
                const literal = matchDatatypeLiteral[1];
                const datatype = matchDatatypeLiteral[2];
                const datatypeQualified = showQualify(datatype, prefixMap);
                const datatypeElement = showQualified(datatypeQualified, prefixMap);
                return {
                    type: 'DatatypeLiteral',
                    prefix: '',
                    localName: '',
                    str: `"${literal}"`,
                    datatype: datatype,
                    datatypeElement: datatypeElement,
                    node: node
                }
            }
            const langLiteralRegex = /\"(.*)\"@(.*)/g;
            const matchLangLiteral = langLiteralRegex.exec(node);
            if (matchLangLiteral) {
                const literal = matchLangLiteral[1];
                const lang = matchLangLiteral[2];
                return {
                    type: 'LangLiteral',
                    prefix: '',
                    localName: '',
                    str: `"${literal}"@${lang}`,
                    datatype: null,
                    node: node
                }
            }
          const literalRegex = /\"(.*)\"/g;
          const matchLiteral = literalRegex.exec(node);
          if (matchLiteral) return {
                type: 'Literal',
                prefix: '',
                localName: '',
                str: node,
                datatype: null,
                node: node
          };
          if (node.type === 'bnode') return {
              type: 'BNode',
              prefix: '',
              localName: node.value,
              str: `_:${node.value}`,
              node: node
          }
          console.log(`ShowQualify: Unknown format for node: ${JSON.stringify(node)}`);
            return {
                type: 'Unknown',
                prefix: '',
                localName: '',
                str: node,
                datatype: null,
                node: node
            };
        }
    } else {
        return {
            type: 'empty',
            prefix: '',
            localName: '',
            str: '',
            node: node
        }
    }
}

export function showQualified(qualified, prefixes) {
    // console.log(`showQualified ${JSON.stringify(qualified)}`)
    switch (qualified.type) {
        case 'RelativeIRI': return <span>{qualified.str}</span>
        case 'QualifiedName':
            // console.log(`QualifiedName: ${qualified.prefix}`)
            if (prefixes.includes(qualified.prefix)) {
                return <Fragment>
                    <a href={API.wikidataOutgoingRoute + "?node=" + encodeURIComponent(qualified.uri)}>{qualified.str}</a>
                    <a href={qualified.uri}><ExternalLinkIcon /></a>
                </Fragment>
            } else {
                return <fragment>{qualified.str} <a href={qualified.uri}><ExternalLinkIcon/></a></fragment>
            }
        case 'FullIRI': return <a href={qualified.uri}>{qualified.str}</a>;
        case 'DatatypeLiteral' : return <span>{qualified.str}^^<a href={qualified.datatype}>&lt;{qualified.datatype}&gt;</a></span>;
        case 'Literal' : return <span>{qualified.str}</span>;
        case 'LangLiteral' : return <span>{qualified.str}</span>;
        default:
            console.error(`Unknown type for qualified value`);
            return <span>{qualified.str}</span>
    }
}

/* Converts SPARQL representation to Turtle representation */
export function cnvValueFromSPARQL(value) {
    switch (value.type) {
        case 'uri': return `<${value.value}>`;
        case 'literal':
            if (value.datatype) {
                switch (value.datatype) {
                    case "http://www.w3.org/2001/XMLSchema#integer": return `${value.value}` ;
                    case "http://www.w3.org/2001/XMLSchema#decimal": return `${value.value}` ;
                    default: return `"${value.value}"^^${value.datatype}`;
                }
            }
            if (value['xml:lang']) return `"${value.value}"@${value['xml:lang']}`;
            return `"${value.value}"`;
        default:
            console.error(`cnvValueFromSPARQL: Unknown value type for ${value}`)
            return value
    }
}


export function paramsFromStateEndpoint(state) {
    let params = {};
    params['endpoint'] = state.endpoint;
    return params;
}


export function format2mode(format) {
    if (format) {
        switch (format.toUpperCase()) {
            case 'TURTLE':
                return 'turtle';
            case 'RDF/XML':
                return 'xml';
            case 'SPARQL':
                return 'sparql';
            case 'HTML':
                return 'xml';
            case 'JSON-LD':
                return 'javascript';
            case 'RDF/JSON':
                return 'javascript';
            case 'TRIG':
                return 'xml';
            case 'SHEXC':
                return 'shex';
            default:
                return 'turtle'
        }
    } else return 'turtle'
}