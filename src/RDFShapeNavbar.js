import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

class RDFShapeNavbar extends React.Component {
 render() {
     return (
         <Navbar bg="light" expand="lg">
             <Navbar.Brand href="#home">RDFShape</Navbar.Brand>
             <Navbar.Toggle aria-controls="basic-navbar-nav" />
             <Navbar.Collapse id="basic-navbar-nav">
                 <Nav className="mr-auto">
                     <NavDropdown title="Data" id="basic-nav-dropdown">
                         <NavDropdown.Item href="/dataInfo">Info</NavDropdown.Item>
                         <NavDropdown.Item href="/dataConversions">Convert</NavDropdown.Item>
                         <NavDropdown.Item href="/dataVisualize">Visualize</NavDropdown.Item>
                         <NavDropdown.Item href="/dataQuery">Query</NavDropdown.Item>
                         <NavDropdown.Item href="/dataExtract">Extract ShEx</NavDropdown.Item>
                     </NavDropdown>
                     <NavDropdown title="Endpoint" id="basic-nav-dropdown">
                         <NavDropdown.Item href="/endpointInfo">Endpoint Info</NavDropdown.Item>
                         <NavDropdown.Item href="/endpointQuery">Query</NavDropdown.Item>
                         <NavDropdown.Item href="/endpointExtract">Extract ShEx</NavDropdown.Item>
                     </NavDropdown>
                     <NavDropdown title="ShEx" id="basic-nav-dropdown">
                         <NavDropdown.Item href="/validateShEx">Validate data with ShEx</NavDropdown.Item>
                         <NavDropdown.Item href="/ShExConversions">Convert ShEx formats</NavDropdown.Item>
                         <NavDropdown.Item href="/ShExToSHACL">ShEx &#8594; SHACL</NavDropdown.Item>
                     </NavDropdown>
                     <NavDropdown title="SHACL" id="basic-nav-dropdown">
                         <NavDropdown.Item href="/validateSHACL">Validate data with ShEx</NavDropdown.Item>
                         <NavDropdown.Item href="/SHACLConversions">Convert ShEx formats</NavDropdown.Item>
                         <NavDropdown.Item href="/SHACLToShEx">SHACL &#8594; ShEx</NavDropdown.Item>
                     </NavDropdown>
                     <NavDropdown title="Wikidata" id="basic-nav-dropdown">
                         <NavDropdown.Item href="/wikidataQuery">Query</NavDropdown.Item>
                         <NavDropdown.Item href="/wikidataExtract">Extract ShEx</NavDropdown.Item>
                     </NavDropdown>
                     <NavDropdown title="API" id="basic-nav-dropdown">
                         <NavDropdown.Item href="https://app.swaggerhub.com/apis-docs/labra/rdfshape/1.0.1">API Docs</NavDropdown.Item>
                     </NavDropdown>
                     <NavDropdown title="Help" id="basic-nav-dropdown">
                         <NavDropdown.Item href="https://github.com/labra/rdfshape/wiki/RDFShape---Help">Help</NavDropdown.Item>
                         <NavDropdown.Item href="/about">About</NavDropdown.Item>
                     </NavDropdown>
                 </Nav>
             </Navbar.Collapse>
         </Navbar>
     );
 }
}

export default RDFShapeNavbar;
