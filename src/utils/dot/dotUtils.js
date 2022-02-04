import Viz from "viz.js/viz.js";
import API from "../../API";
const { Module, render } = require("viz.js/full.render.js");

// https://github.com/mdaines/viz.js/wiki/API
async function convertDot(dot, engine, format) {
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

  try {
    const data = await promise;
    return {
      data,
      textual,
    };
  } catch (err) {
    throw err;
  }
}

export async function processDotData(dot) {
  return await convertDot(dot, API.formats.dot.toLowerCase(), API.formats.svg);
}
