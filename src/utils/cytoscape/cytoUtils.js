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

      label: "data(label)",
      "control-point-step-size": 40,
    },
  },

    {
    selector: "edge",
    style: {
      width: 3,
      "line-color": "#ccc",
      "target-arrow-color": "#ccc",
      "target-arrow-shape": "triangle",
      label: "data(label)",
      "curve-style": "bezier",
      "control-point-step-size": 40,
    },
  },
];

// Cytoscape layouts available
export const breadthfirst = {
  name: "breadthfirst",
  uiName: "tree",
  fit: true,
  nodeDimensionsIncludeLabels: true,
  directed: false,
  spacingFactor: 1,
};
export const circle = {
  name: "circle",
  uiName: "circle",
  fit: true,
  nodeDimensionsIncludeLabels: true,
  directed: false,
  grid: true,
};
export const layouts = [breadthfirst, circle];

export const getLayoutByField = (fieldName, fieldValue) => {
  return layouts.find((layout) => layout[fieldName] == fieldValue);
};

export const getLayoutByName = (name) => getLayoutByField("name", name);
export const getLayoutByUIName = (name) => getLayoutByField("uiName", name);
