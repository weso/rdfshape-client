import React, { useRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import {
  cytoscapeMaxZoom,
  cytoscapeMinZoom,
  cytoWheelSensitivity,
  stylesheetCytoscape
} from "./cytoUtils";

// Custom component for rendering cytoscape items

// Takes of creating the ref and handling other data so other components
// can just plug this one in
const CytoscapeContainer = ({
  elements,
  layoutControls,
  styles,
  cytoControls,
}) => {
  // Ref of cytoscape element
  const refCyto = useRef(null);

  const [cytoObject, setCytoObject] = cytoControls;
  const [layout, setLayout] = layoutControls;

  return (
    <CytoscapeComponent
      textureOnViewport
      elements={elements}
      stylesheet={[
        ...stylesheetCytoscape, // default styles
        ...(styles || []), // runtime changed styles
      ]}
      zoomingEnabled={true}
      minZoom={cytoscapeMinZoom}
      maxZoom={cytoscapeMaxZoom}
      wheelSensitivity={cytoWheelSensitivity}
      panningEnabled={true}
      boxSelectionEnabled={false}
      className={"cyto-container"}
      layout={layout}
      cy={(cy) => {
        cy.ready(() => {
          refCyto.current = cy;
          setCytoObject(cy);
        });
      }}
    />
  );
};

export default CytoscapeContainer;
