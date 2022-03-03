import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import API from "./API.js";
import Examples from "./utils/examples";

class RDFShapeNavbar extends React.Component {
  render() {
    return (
      <Navbar
        id="navigation"
        role="navigation"
        bg="primary"
        expand="md"
        filled="true"
        variant="dark"
      >
        <Navbar.Brand href="/">
          <img
            src="/img/256.png"
            width="32"
            height="32"
            className="d-inline-block align-top"
            alt="RDFShape logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse color="white" id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown
              title={API.texts.navbarHeaders.rdf}
              id="nav-dropdown-data"
              className="navbar-title"
            >
              <NavDropdown.Item href={API.routes.client.dataInfoRoute}>
                {API.texts.navbarHeaders.analysis}
              </NavDropdown.Item>
              <NavDropdown.Item href={API.routes.client.dataConvertRoute}>
                {API.texts.navbarHeaders.conversion}
              </NavDropdown.Item>
              <NavDropdown.Item href={API.routes.client.dataMergeRoute}>
                {API.texts.navbarHeaders.merge}
              </NavDropdown.Item>
              <NavDropdown.Item href={API.routes.client.dataQueryRoute}>
                {API.texts.navbarHeaders.sparqlQuery}
              </NavDropdown.Item>
              <NavDropdown.Item href={API.routes.client.dataExtractRoute}>
                {API.texts.navbarHeaders.shexExtract}
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title={API.texts.navbarHeaders.endpoint}
              id="nav-dropdown-endpoint"
            >
              <NavDropdown.Item href={API.routes.client.endpointInfoRoute}>
                {API.texts.navbarHeaders.information}
              </NavDropdown.Item>
              <NavDropdown.Item href={API.routes.client.endpointQueryRoute}>
                {API.texts.navbarHeaders.sparqlQuery}
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title={API.texts.navbarHeaders.shex}
              id="nav-dropdown-shex"
            >
              <NavDropdown.Item href={API.routes.client.shexInfoRoute}>
                {API.texts.navbarHeaders.analysis}
              </NavDropdown.Item>
              <NavDropdown.Item href={API.routes.client.shexConvertRoute}>
                {API.texts.navbarHeaders.conversion}
              </NavDropdown.Item>
              <NavDropdown.Item href={API.routes.client.shexValidateRoute}>
                {API.texts.navbarHeaders.validationUser}
              </NavDropdown.Item>
              <NavDropdown.Item href={API.routes.client.xmi2ShexRoute}>
                {API.texts.navbarHeaders.umlToShEx}
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title={API.texts.navbarHeaders.shacl}
              id="nav-dropdown-shacl"
            >
              <NavDropdown.Item href={API.routes.client.shaclInfoRoute}>
                {API.texts.navbarHeaders.analysis}
              </NavDropdown.Item>
              <NavDropdown.Item href={API.routes.client.shaclConvertRoute}>
                {API.texts.navbarHeaders.conversion}
              </NavDropdown.Item>
              <NavDropdown.Item href={API.routes.client.shaclValidateRoute}>
                {API.texts.navbarHeaders.validationUser}
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title={API.texts.navbarHeaders.shapeMap}
              id="nav-dropdown-shapemap"
            >
              <NavDropdown.Item href={API.routes.client.shapeMapInfoRoute}>
                {API.texts.navbarHeaders.analysis}
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link target="_blank" href={API.routes.utils.wikishape}>
              {API.texts.navbarHeaders.wikishape}
            </Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown
              title={API.texts.navbarHeaders.examples}
              id="nav-dropdown-examples"
              className="mr-sm-2"
            >
              <NavDropdown.Item
                href={`${API.routes.client.dataInfoRoute}?${
                  API.queryParameters.data.data
                }=${encodeURIComponent(Examples.dataInfoExample)}&${
                  API.queryParameters.data.format
                }=turtle&${API.queryParameters.data.inference}=${
                  API.inferences.none
                }`}
              >
                Data information
              </NavDropdown.Item>
              <NavDropdown.Item
                href={`${API.routes.client.dataQueryRoute}?${
                  API.queryParameters.data.source
                }=${API.sources.byText}&${
                  API.queryParameters.data.data
                }=${encodeURIComponent(Examples.dataQueryExampleData)}&${
                  API.queryParameters.data.format
                }=${API.formats.turtle}&${API.queryParameters.data.inference}=${
                  API.inferences.none
                }&${API.queryParameters.query.query}=${encodeURIComponent(
                  Examples.dataQueryExampleQuery
                )}&${API.queryParameters.query.source}=${API.sources.byText}`}
              >
                Data query
              </NavDropdown.Item>
              <NavDropdown.Item
                href={`${API.routes.client.shexValidateRoute}?${
                  API.queryParameters.schema.source
                }=${API.sources.byText}&${API.queryParameters.data.source}=${
                  API.sources.byText
                }&${API.queryParameters.data.data}=${encodeURIComponent(
                  Examples.shexValidateExampleData
                )}&${API.queryParameters.data.format}=${API.formats.turtle}&${
                  API.queryParameters.schema.schema
                }=${encodeURIComponent(Examples.shexValidateExampleSchema)}&${
                  API.queryParameters.schema.engine
                }=${API.engines.shex}&${API.queryParameters.schema.format}=${
                  API.formats.shexc
                }&${API.queryParameters.shapeMap.shapeMap}=${encodeURIComponent(
                  Examples.shexValidateExampleShapeMap
                )}&${API.queryParameters.shapeMap.source}=${
                  API.sources.byText
                }&${API.queryParameters.shapeMap.format}=${
                  API.formats.compact
                }`}
              >
                ShEx validation
              </NavDropdown.Item>
              <NavDropdown.Item
                href={`${API.routes.client.shaclValidateRoute}?${
                  API.queryParameters.schema.source
                }=${API.sources.byText}&${API.queryParameters.data.source}=${
                  API.sources.byText
                }&${API.queryParameters.data.data}=${encodeURIComponent(
                  Examples.shaclValidateExampleData
                )}&${API.queryParameters.data.format}=${API.formats.turtle}&${
                  API.queryParameters.data.inference
                }=${API.inferences.none}&${
                  API.queryParameters.schema.schema
                }=${encodeURIComponent(Examples.shaclValidateExampleSchema)}&${
                  API.queryParameters.schema.engine
                }=${API.engines.shaclex}&${API.queryParameters.schema.format}=${
                  API.formats.turtle
                }&${API.queryParameters.schema.triggerMode}=${
                  API.triggerModes.targetDecls
                }`}
              >
                SHACL validation
              </NavDropdown.Item>
              <NavDropdown.Item
                href={`${API.routes.client.endpointQueryRoute}?${
                  API.queryParameters.wbQuery.endpoint
                }=${Examples.wikidataQueryExampleEndpoint}&${
                  API.queryParameters.query.query
                }=${encodeURIComponent(Examples.wikidataQueryExampleQuery)}&${
                  API.queryParameters.query.source
                }=${API.sources.byText}`}
              >
                Wikidata query
              </NavDropdown.Item>
              <NavDropdown.Item
                href={`${API.routes.client.xmi2ShexRoute}?${
                  API.queryParameters.schema.targetEngine
                }=${API.engines.shumlex}&${
                  API.queryParameters.schema.targetFormat
                }=${API.formats.xmi}&${
                  API.queryParameters.uml.uml
                }=${encodeURIComponent(Examples.umlExampleData)}&${
                  API.queryParameters.uml.format
                }=${API.formats.xmi}&${API.queryParameters.uml.source}=${
                  API.sources.byText
                }`}
              >
                ShEx from UML
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title={API.texts.navbarHeaders.help}
              id="nav-dropdown-help"
            >
              <NavDropdown.Item
                target="_blank"
                href={API.routes.utils.projectSite}
              >
                {API.texts.navbarHeaders.projectSite}
              </NavDropdown.Item>
              <NavDropdown.Item target="_blank" href={API.routes.utils.apiDocs}>
                {API.texts.navbarHeaders.apiDocs}
              </NavDropdown.Item>
              <NavDropdown.Item href="/about">
                {API.texts.navbarHeaders.about}
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default RDFShapeNavbar;
