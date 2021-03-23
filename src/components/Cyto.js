import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import CytoscapeComponent from "react-cytoscapejs";

function CytoSchema({ elements, layout }) {
  const cose = "cose";
  const random = "random";
  const circle = "circle";

  const [layoutName, setLayoutName] = useState(layout || random);

  const style2 = {
    width: "60vw",
    height: "60vh",
    border: "solid",
    backgroundColor: "rgb(250, 250, 250)",
  };
  const stylesheet = [
    // the stylesheet for the graph
    {
      selector: "node",
      style: {
        "background-color": "blue",
        label: "data(label)",
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

  return (
    <div>
      <CytoscapeComponent
        elements={elements}
        style={style2}
        stylesheet={stylesheet}
        layout={{ name: layoutName }}
      />

      <Form.Group>
        <Button
          variant="secondary"
          onClick={() => setLayoutName(cose)}
          value="cose"
        >
          COSE Layaout
        </Button>
        <Button
          variant="secondary"
          onClick={() => setLayoutName(random)}
          value="random"
        >
          Random
        </Button>
        <Button
          variant="secondary"
          onClick={() => setLayoutName(circle)}
          value="circle"
        >
          Circle
        </Button>
      </Form.Group>
    </div>
  );
}

function Cyto({ layout, elements, refCyto }) {
  const stylesheet = [
    // the stylesheet for the graph
    {
      selector: "node",
      style: {
        "background-color": "blue",
        label: "data(label)",
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

  return (
    <CytoscapeComponent
      className={"width-100 height-100"}
      elements={elements}
      stylesheet={stylesheet}
      minZoom={0.2}
      maxZoom={4.5}
      layout={{ name: layout || "cose" }}
      cy={(cy) => {
        refCyto && (refCyto.current = cy);
      }}
    />
  );
}

export default Cyto;
