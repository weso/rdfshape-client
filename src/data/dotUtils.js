import React from "react";
import Viz from "viz.js/viz.js";
import API from "../API";
import ResponseError from "../utils/ResponseError";
const { Module, render } = require("viz.js/full.render.js");

// https://github.com/mdaines/viz.js/wiki/API
export function convertDot(dot, engine, format, setError, setVisualization) {
  let viz = new Viz({
    Module: () => Module({ TOTAL_MEMORY: 1 << 25 }),
    render,
  });

  // Process the dot regarding the needed format
  const options = { engine };
  let promise = null;
  let textual = true;

  switch (format) {
    // SVG
    case API.formats.svg:
      promise = viz.renderSVGElement(dot, {
        ...options,
        mimeType: API.mimeTypes.svg,
      });
      textual = false;
      break;

    // Image (deprecated)
    case API.formats.png:
      promise = viz.renderImageElement(dot, {
        ...options,
        format: "png-image-element",
        mimeType: API.mimeTypes.png,
        scale: 0,
      });
      textual = false;
      break;

    // JSON
    case API.formats.json:
      promise = viz.renderJSONObject(dot, options);
      textual = true;
      break;

    // String
    case API.formats.ps:
    case API.formats.dot:
    default:
      promise = viz.renderString(dot, options);
      textual = true;
      break;
  }

  promise
    .then((data) => {
      setVisualization({
        data,
        textual,
      });
    })
    .catch((error) => {
      viz = new Viz({ Module, render });
      setError(
        <ResponseError
          errorOrigin={API.routes.server.root}
          errorMessage={`Could not convert to ${format}.\n ${error}\nDOT:\n${dot.toString()}`}
        />
      );
    });
}
