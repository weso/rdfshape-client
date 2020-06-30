import React, {useState} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function CytoSchema(props) {

    const cose = "cose";
    const random = "random";
    const circle = "circle" ;

    const [layoutName, setLayoutName] = useState(random);

    const style2 = {
        width: '60vw',
        height: '60vh',
        border: 'solid',
        backgroundColor: 'rgb(250, 250, 250)'
    }
    const stylesheet = [ // the stylesheet for the graph
        {
            selector: 'node',
            style: {
                'background-color': 'blue',
                'label': 'data(label)'
            }
        },

        {
            selector: 'edge',
            style: {
                'width': 3,
                'line-color': '#ccc',
                'target-arrow-color': '#ccc',
                'target-arrow-shape': 'triangle',
                'label': 'data(label)',
                'curve-style': 'bezier',
                'control-point-step-size': 40
            }
        }
    ]

    return <div>
        <CytoscapeComponent
            elements={props.elements}
            style={style2}
            stylesheet={stylesheet}
            layout={{name: layoutName}}
        />

        <Form.Group>
            <Button variant="secondary" onClick={() => setLayoutName(cose)} value="cose">COSE Layaout</Button>
            <Button variant="secondary" onClick={() => setLayoutName(random)} value="random">Random</Button>
            <Button variant="secondary" onClick={() => setLayoutName(circle)} value="circle">Circle</Button>
        </Form.Group>
    </div>
}

function Cyto(props) {

    const stylesheet = [ // the stylesheet for the graph
        {
            selector: 'node',
            style: {
                'background-color': 'blue',
                'label': 'data(label)'
            }
        },

        {
            selector: 'edge',
            style: {
                'width': 3,
                'line-color': '#ccc',
                'target-arrow-color': '#ccc',
                'target-arrow-shape': 'triangle',
                'label': 'data(label)',
                'curve-style': 'bezier',
                'control-point-step-size': 40
            }
        }
    ]

    return <CytoscapeComponent className={"width-100 height-100 border"}
                               style={{ backgroundColor: 'rgb(250, 250, 250)'}}
        elements={props.elements}
        stylesheet={stylesheet}
        layout={{name: props.layout || "cose"}}
    />
}

export default Cyto;
