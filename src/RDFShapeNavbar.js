import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import API from './API.js'


class RDFShapeNavbar extends React.Component {

    render() {
        return (
            <Navbar bg="primary" expand="md" filled="true" variant="dark">
                <Navbar.Brand href="/">RDFShape</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <NavDropdown title="Data" id="basic-nav-dropdown">
                            <NavDropdown.Item href={API.dataInfoRoute}>Info</NavDropdown.Item>
                            <NavDropdown.Item href={API.dataConvertRoute}>Convert</NavDropdown.Item>
                            <NavDropdown.Item href={API.dataVisualizeRoute}>Visualize (Graphviz)</NavDropdown.Item>
                            <NavDropdown.Item href={API.cytoVisualizeRoute}>Visualize (Cytoscape)</NavDropdown.Item>
                            <NavDropdown.Item href={API.dataQueryRoute}>Query</NavDropdown.Item>
                            <NavDropdown.Item href={API.dataExtractRoute}>Extract ShEx</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Endpoint" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/endpointInfo">Endpoint Info</NavDropdown.Item>
                            <NavDropdown.Item href="/endpointQuery">Query</NavDropdown.Item>
                            <NavDropdown.Item href="/endpointExtract">Extract ShEx</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="ShEx" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/shexValidate">Validate data with ShEx</NavDropdown.Item>
                            <NavDropdown.Item href="/shexValidateEndpoint">Validate endpoint data with ShEx</NavDropdown.Item>
                            <NavDropdown.Item href="/shexInfo">Info about ShEx schema</NavDropdown.Item>
                            <NavDropdown.Item href="/shexVisualize">Visualize ShEx schema</NavDropdown.Item>
                            <NavDropdown.Item href="/shexVisualizeCytoscape">Visualize ShEx schema (Cytoscape)</NavDropdown.Item>
                            <NavDropdown.Item href="/shexConvert">Convert ShEx formats</NavDropdown.Item>
                            <NavDropdown.Item href="/shex2shacl">ShEx &#8594; SHACL</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="SHACL" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/shaclValidate">Validate data with ShEx</NavDropdown.Item>
                            <NavDropdown.Item href="/shaclConvert">Convert ShEx formats</NavDropdown.Item>
                            <NavDropdown.Item href="/shacl2shex">SHACL &#8594; ShEx</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Wikidata" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/wikidataQuery">Query</NavDropdown.Item>
                            <NavDropdown.Item href="/wikidataExtract">Extract ShEx</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <NavDropdown title="Help" id="basic-nav-dropdown" className="mr-sm-2">
                            <NavDropdown.Item href="https://app.swaggerhub.com/apis-docs/labra/rdfshape/1.0.1">API
                                Docs</NavDropdown.Item>
                            <NavDropdown.Item
                                href="https://github.com/labra/rdfshape/wiki/RDFShape---Help">Help</NavDropdown.Item>
                            <NavDropdown.Item href="/about">About</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default RDFShapeNavbar;
