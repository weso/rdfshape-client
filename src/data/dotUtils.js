import Viz from "viz.js/viz.js";
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
    case "SVG":
      promise = viz.renderSVGElement(dot, {
        ...options,
        MimeType: "image/svg+xml",
      });
      textual = false;
      break;

    // Image
    case "PNG":
      promise = viz.renderImageElement(dot, {
        ...options,
        MimeType: "image/png",
        scale: 0
      });
      textual = false;
      break;

    // JSON
    case "JSON":
      promise = viz.renderJSONObject(dot, options);
      textual = true;
      break;

    // String
    case "PS":
    case "DOT":
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
      setError(`Error converting to ${format}: ${error}\nDOT:\n${dot}`);
    });
}
