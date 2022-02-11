// Common settings for cytoscape visualizations
export const cytoscapeMinZoom = 0.05;
export const cytoscapeMaxZoom = 3;
export const cytoSpacingFactor = 1;
export const cytoWheelSensitivity = 0.3;

// Cytoscape stylesheet for nodes and edges
export const cytoscapeDefaultNodeColor = "#ff5722";
export const stylesheetCytoscape = [
  {
    selector: "node",
    style: {
      "background-color": cytoscapeDefaultNodeColor,
      label: "data(label)",
    },
  },
  {
    selector: "edge",
    style: {
      width: 3,
      "line-color": "#888",
      "target-arrow-color": "#888",
      "target-arrow-shape": "triangle",
      "curve-style": "unbundled-bezier",
      "control-point-step-size": 20,
      label: "data(label)",
    },
  },
];

export const shumlexCytoscapeStyle = [
  // Additional styles and settings for cytoscape visuals created from a Shumlex graph.
  // Apply in addition to the default styles.
  // Use the "name" attribute of each element as its label
  {
    selector: "node",
    style: {
      label: "data(name)",
    },
  },
  {
    selector: "edge",
    style: {
      label: "data(name)",
    },
  },
];

// Cytoscape layouts available
const spacingFactor = 1.25;
export const breadthfirst = {
  name: "breadthfirst",
  uiName: "tree",
  fit: true,
  nodeDimensionsIncludeLabels: true,
  directed: false,
  spacingFactor,
};
export const circle = {
  name: "circle",
  uiName: "circle",
  fit: true,
  nodeDimensionsIncludeLabels: true,
  directed: false,
  grid: true,
  spacingFactor,
};
export const layouts = [breadthfirst, circle];

export const getLayoutByField = (fieldName, fieldValue) => {
  return layouts.find((layout) => layout[fieldName] == fieldValue);
};

export const getLayoutByName = (name) => getLayoutByField("name", name);
export const getLayoutByUIName = (name) => getLayoutByField("uiName", name);
