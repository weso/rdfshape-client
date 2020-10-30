import "bootstrap/dist/css/bootstrap.min.css";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/turtle/turtle";
import "codemirror/mode/xml/xml";
import React, { useState } from 'react';
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { SketchPicker } from 'react-color';
import CytoscapeComponent from "react-cytoscapejs";

function CytoSchema(props) {

    // Layouts
    const defaultLayout = 'cose';
    const layouts = [
        'cose',
        'random',
        'circle',
        'grid',
        'concentric'
    ];

    // Colors
    const defaultBackgroundColor = 'rgb(250, 250, 250)';

    const defaultNodesColor = 'rgb(0,0,250)';
    const defaultNodesBackgroundColor = 'rgb(200,150,20)';

    const defaultDatatypeColor = 'rgb(0,150,150)'
    const defaultDatatypeBackgroundColor = 'rgb(250,250,200)'


    // shapes
    const shapes = [
        'round-rectangle',
        'rectangle',
        'circle',
        'ellipse',
        'triangle',
        'bottom-round-rectangle',
        'cut-rectangle',
        'barrel',
        'rhomboid',
        'diamond',
        'pentagon',
        'hexagon',
        'concave-hexagon',
        'heptagon',
        'octagon',
        'star',
        'tag',
        'vee'
    ];
    const defaultShapeShapes = 'round-rectangle';
    const defaultDatatypeShape = 'rectangle';

    const [layoutName, setLayoutName] = useState(defaultLayout);
    const [backgroundColor, setBackgroundColor] = useState(defaultBackgroundColor);
    const [nodesColor, setNodesColor] = useState(defaultNodesColor);
    const [nodesBackgroundColor, setNodesBackgroundColor] = useState(defaultNodesBackgroundColor);
    const [shapesShape, setShapesShape] = useState(defaultShapeShapes);

    const [datatypeColor, setDatatypeColor] = useState(defaultDatatypeColor);
    const [datatypeBackgroundColor, setDatatypeBackgroundColor] = useState(defaultDatatypeBackgroundColor);
    const [datatypeShape, setDatatypeShape] = useState(defaultDatatypeShape);

    const [cy, setCy] = useState(null);

    const style = {
        width: '60vw',
        height: '60vh',
        border: 'solid',
        backgroundColor: backgroundColor
    }
    const stylesheet = [ // the stylesheet for the graph
        {   selector: 'node[type="datatype"]',
            style: {
                'shape': datatypeShape,
                'color': datatypeColor,
                'background-color': datatypeBackgroundColor,
                'label': 'data(label)',
                'text-valign' : 'center',
                'text-halign' : 'center',
                'padding-left' : '3px',
                'padding-right' : '3px',
                'text-wrap': 'wrap',
            }
        },
        {
            selector: 'node',
            style: {
                'shape': shapesShape,
                'color': nodesColor,
                'background-color': nodesBackgroundColor,
                'label': 'data(label)',
                'text-valign' : 'center',
                'text-halign' : 'center',
                'padding-left' : '3px',
                'padding-right' : '3px',
                'text-wrap': 'wrap',
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
        <Container>
            <Row>
                <Col>
        <CytoscapeComponent
            elements={props.elements}
            style={style}
            stylesheet={stylesheet}
            layout={{name: layoutName}}
            cy={(cy) => setCy(cy)}
        />
                </Col>
            </Row>
<Row>
    <Col>
        <Form.Group>
            <Form.Label>Layout</Form.Label>
            <Form.Control as="select" onChange={(e) => {
                setLayoutName(e.target.value)
            }}>{ layouts.map((layout,key) => (
                <option key={key} defaultValue={layout === layoutName}>{layout}</option>
            ))}</Form.Control>
        </Form.Group>
    </Col>
    <Col>
        <Form.Group>
            <Form.Label>Background</Form.Label>
            <SketchPicker
                color={ defaultBackgroundColor }
                onChangeComplete={(color) => {
                    setBackgroundColor(color.hex)
                } }
            />
        </Form.Group>
    </Col>
    <Col>
        <Form.Group>
            <Form.Label>Nodes color</Form.Label>
            <SketchPicker
                color={ defaultNodesColor }
                onChangeComplete={(color) => {
                    setNodesColor(color.hex)
                } }
            />
        </Form.Group>
    </Col>
    <Col>
        <Form.Group>
            <Form.Label>Nodes background color</Form.Label>
            <SketchPicker
                color={ defaultNodesBackgroundColor }
                onChangeComplete={(color) => {
                    console.log(`Color change: ${color.hex}`)
                    setNodesBackgroundColor(color.hex)
                } }
            />
        </Form.Group>
    </Col>
    <Col>
        <Form.Group>
            <Form.Label>Shape of shapes</Form.Label>
            <Form.Control as="select" onChange={(e) => setShapesShape(e.target.value)}>
                { shapes.map((shape,key) => (
                    <option key={key} defaultValue={shape === shapesShape}>{shape}</option>
                ))
                }
            </Form.Control>
        </Form.Group>
    </Col>
    </Row>
        </Container>
    </div>
}


function TestCyto(props)  {
    const data = /*{
        nodes: [
            { data: { id: 'a', parent: 'b' }, position: { x: 215, y: 85 } },
            { data: { id: 'b' } },
            { data: { id: 'c', parent: 'b' }, position: { x: 300, y: 85 } },
            { data: { id: 'd' }, position: { x: 215, y: 175 } },
            { data: { id: 'e' } },
            { data: { id: 'f', parent: 'e' }, position: { x: 300, y: 175 } }
        ],
        edges: [
            { data: { id: 'ad', source: 'a', target: 'd' } },
            { data: { id: 'eb', source: 'e', target: 'b' } }

        ]
    } ; */
    [
        { data: { id: 0, label: '<User>', type: 'shape' } },
        { data: { id: 1, label: '<Product>', type: 'shape' } },
        { data: { id: 2, label: '<Company>', type: 'shape' } },
        { data: { id: 3, label: 'xsd:string', class: 'datatype' } },
        { data: { id: 4, label: 'xsd:date', class: 'datatype' } },
        { data: { id: 5, label: 'xsd:integer', class: 'datatype' } },
        { data: { source: 0, target: 1, label: ':buys' } },
        { data: { source: 0, target: 2, label: 'schema:worksFor' } },
        { data: { source: 2, target: 0, label: 'schema:employee' } },
        { data: { source: 0, target: 3, label: 'schema:name' } },
        { data: { source: 0, target: 4, label: 'schema:birthDate' } },
        { data: { source: 0, target: 0, label: 'schema:knows' } },
        { data: { source: 2, target: 5, label: ':id' } },
    ];
    const mode = "cose";
    const response = {
        "labels": [
            {
                "shapeLabel": "<http://example.org/User>",
                "node": 0
            },
            {
                "shapeLabel": "<http://example.org/Product>",
                "node": 1
            },
            {
                "shapeLabel": "<http://example.org/Company>",
                "node": 2
            }
        ],
        "components": [
            {
                "node": 0,
                "component": {
                    "id": 0,
                    "label": ":User",
                    "entries": [
                        [
                            {
                                "name": "Closed"
                            }
                        ],
                        [
                            {
                                "name": ":name",
                                "card": " ",
                                "href": "http://example.org/name",
                                "valueConstraints": [
                                    {
                                        "name": "xsd:string",
                                        "href": "http://www.w3.org/2001/XMLSchema#string"
                                    }
                                ]
                            }
                        ]
                    ],
                    "href": "http://example.org/User"
                }
            },
            {
                "node": 2,
                "component": {
                    "id": 2,
                    "label": ":Company",
                    "entries": [
                        [
                            {
                                "name": ":name",
                                "card": " ",
                                "href": "http://example.org/name",
                                "valueConstraints": [
                                    {
                                        "name": "xsd:string",
                                        "href": "http://www.w3.org/2001/XMLSchema#string"
                                    }
                                ]
                            }
                        ]
                    ],
                    "href": "http://example.org/Company"
                }
            },
            {
                "node": 1,
                "component": {
                    "id": 1,
                    "label": ":Product",
                    "entries": [
                        [
                            {
                                "name": ":code",
                                "card": " ",
                                "href": "http://example.org/code",
                                "valueConstraints": [
                                    {
                                        "name": "xsd:integer",
                                        "href": "http://www.w3.org/2001/XMLSchema#integer"
                                    }
                                ]
                            }
                        ]
                    ],
                    "href": "http://example.org/Product"
                }
            }
        ],
        "links": [
            {
                "source": 2,
                "target": 0,
                "label": ":hasEmployee",
                "href": "http://example.org/hasEmployee",
                "card": "*"
            },
            {
                "source": 0,
                "target": 0,
                "label": ":knows",
                "href": "http://example.org/knows",
                "card": " "
            },
            {
                "source": 0,
                "target": 2,
                "label": ":worksFor",
                "href": "http://example.org/worksFor",
                "card": " "
            },
            {
                "source": 0,
                "target": 1,
                "label": ":buys",
                "href": "http://example.org/buys",
                "card": {
                    "min": 1,
                    "max": 10
                }
            }
        ]
    }

    return (
        <div>
            <h1>Test Cytoscape schemas</h1>
            <CytoSchema id="testCytoSchema"
                     elements={data}
                     mode={mode}
            />
        </div>
    );
}

export default TestCyto;
