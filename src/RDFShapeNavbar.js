import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import API from "./API.js";

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
                href={`${API.routes.client.dataInfoRoute}?${API.queryParameters.data.data}=%40prefix%20%3A%20%20%20%20%20%20<http%3A%2F%2Fexample.org%2F>%20.%0A%40prefix%20schema%3A%20<http%3A%2F%2Fschema.org%2F>%20.%0A%40prefix%20item%3A%20%20<http%3A%2F%2Fdata.europeana.eu%2Fitem%2F04802%2F>%20.%0A%40prefix%20dbr%3A%20%20%20<http%3A%2F%2Fdbpedia.org%2Fresource%2F>%20.%0A%40prefix%20xsd%3A%20%20%20<http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23>%20.%0A%40prefix%20dcterms%3A%20<http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F>%20.%0A%40prefix%20it%3A%20%20%20%20<http%3A%2F%2Fdata.example.org%2Fitem%2F>%20.%0A%40prefix%20wd%3A%20%20%20%20<http%3A%2F%2Fwww.wikidata.org%2Fentity%2F>%20.%0A%40prefix%20foaf%3A%20%20<http%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F>%20.%0A%0A%3Aalice%20%20a%20%20%20%20%20%20%20foaf%3APerson%20.%0A%0A%3Abob%20%20%20%20a%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20foaf%3APerson%20%3B%0A%20%20%20%20%20%20%20%20schema%3AbirthDate%20%20%20%20%20"1990-07-04"%5E%5Exsd%3Adate%20%3B%0A%20%20%20%20%20%20%20%20foaf%3Aknows%20%20%20%20%20%20%20%20%20%20%20<http%3A%2F%2Fexample.org%2Falice%23me>%20%3B%0A%20%20%20%20%20%20%20%20foaf%3Atopic_interest%20%20wd%3AQ12418%20.%0A%0A%3Acarol%20%20a%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20foaf%3APerson%20%3B%0A%20%20%20%20%20%20%20%20schema%3AbirthDate%20%20"unknown"%20.%0A%0Awd%3AQ12418%20%20dcterms%3Acreator%20%20dbr%3ALeonardo_da_Vinci%20%3B%0A%20%20%20%20%20%20%20%20dcterms%3Atitle%20%20%20%20"Mona%20Lisa"%20.%0A%0Ait%3A243FA%20%20dcterms%3Asubject%20%20wd%3AQ12418%20%3B%0A%20%20%20%20%20%20%20%20dcterms%3Atitle%20%20%20%20"La%20Joconde%20à%20Washington"%40fr%20.%0A&${API.queryParameters.data.format}=turtle&${API.queryParameters.data.inference}=${API.inferences.none}`}
              >
                Data information
              </NavDropdown.Item>
              <NavDropdown.Item
                href={`${API.routes.client.dataQueryRoute}?${API.queryParameters.data.source}=${API.sources.byText}&${API.queryParameters.data.data}=PREFIX%20%3A%20%20%20%20%20%20%20%3Chttp%3A%2F%2Fexample.org%2F%3E%0APREFIX%20schema%3A%20%3Chttp%3A%2F%2Fschema.org%2F%3E%0APREFIX%20xsd%3A%20%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0APREFIX%20foaf%3A%20%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0A%0A%3Aalice%20schema%3Aname%20%20%20%20%20%20%20%20%20%20%20%22Alice%22%20%3B%20%20%20%20%20%20%0A%20%20%20%20%20%20%20schema%3Agender%20%20%20%20%20%20%20%20%20schema%3AFemale%20%3B%0A%20%20%20%20%20%20%20schema%3Aknows%20%20%20%20%20%20%20%20%20%20%3Abob%20.%0A%0A%3Abob%20%20%20schema%3Agender%20%20%20%20%20%20%20%20%20schema%3AMale%20%3B%20%20%0A%20%20%20%20%20%20%20schema%3Aname%20%20%20%20%20%20%20%20%20%20%20%22Robert%22%3B%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20schema%3AbirthDate%20%20%20%20%20%20%221980-03-10%22%5E%5Exsd%3Adate%20.%0A%0A%3Acarol%20schema%3Aname%20%20%20%20%20%20%20%20%20%20%20%22Carol%22%20%3B%20%20%20%20%20%20%0A%20%20%20%20%20%20%20schema%3Agender%20%20%20%20%20%20%20%20%20%22unspecified%22%20%3B%20%20%0A%20%20%20%20%20%20%20foaf%3Aname%20%20%20%20%20%20%20%20%20%20%20%20%20%22Carol%22%20.%0A%0A%3Adave%20%20schema%3Aname%20%20%20%20%20%20%20%20%20%20%20%22Dave%22%3B%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20schema%3Agender%20%20%20%20%20%20%20%20%20%22XYY%22%3B%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20schema%3AbirthDate%20%20%20%20%20%201980%20.%20%20%20%20%20%20%20%20%20%0A%0A%3Aemily%20schema%3Aname%20%22Emily%22%2C%20%22Emilee%22%20%3B%20%20%20%20%20%20%0A%20%20%20%20%20%20%20schema%3Agender%20%20%20%20%20%20%20%20%20schema%3AFemale%20.%0A%0A%3Afrank%20foaf%3Aname%20%20%20%20%20%20%20%20%20%20%20%20%20%22Frank%22%20%3B%20%20%20%20%20%20%0A%20%20%20%20%20%20%20schema%3Agender%3A%20%20%20%20%20%20%20%20schema%3AMale%20.%20%20%0A%0A%3Agrace%20schema%3Aname%20%20%20%20%20%20%20%20%20%20%20%22Grace%22%20%3B%20%20%20%20%20%20%0A%20%20%20%20%20%20%20schema%3Agender%20%20%20%20%20%20%20%20%20schema%3AMale%20%3B%20%20%0A%20%20%20%20%20%20%20schema%3Aknows%20%20%20%20%20%20%20%20%20%20_%3Ax%20.%20%20%20%20%20%20%20%20%20%20%0A%0A%3Aharold%20schema%3Aname%20%20%20%20%20%20%20%20%20%22Harold%22%20%3B%20%20%20%20%0A%20%20%20%20%20%20%20%20schema%3Agender%20%20%20%20%20%20%20schema%3AMale%20%3B%20%0A%20%20%20%20%20%20%20%20schema%3Aknows%20%20%20%20%20%20%20%20%3Agrace%20.%20%20%20%20%20%20&${API.queryParameters.data.format}=turtle&${API.queryParameters.data.inference}=${API.inferences.none}&${API.queryParameters.query.query}=%23 Get all people with name and gender%0APREFIX schema%3A <http%3A%2F%2Fschema.org%2F>%0Aselect %3Fperson %3Fname %3Fgender where {%0A%20 %3Fperson schema%3Aname %3Fname .%0A%20 %3Fperson schema%3Agender %3Fgender %0A}&${API.queryParameters.query.source}=${API.sources.byText}`}
              >
                Data query
              </NavDropdown.Item>
              <NavDropdown.Item
                href={`${API.routes.client.shexValidateRoute}?${API.queryParameters.schema.source}=${API.sources.byText}&${API.queryParameters.data.source}=${API.sources.byText}&${API.queryParameters.data.data}=PREFIX%20%3A%20%20%20%20%20%20%20%3Chttp%3A%2F%2Fexample.org%2F%3E%0APREFIX%20schema%3A%20%3Chttp%3A%2F%2Fschema.org%2F%3E%0APREFIX%20xsd%3A%20%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0APREFIX%20foaf%3A%20%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0A%0A%3Aalice%20schema%3Aname%20%20%20%20%20%20%20%20%20%20%20%22Alice%22%20%3B%20%20%20%20%20%20%20%20%20%20%20%20%23%20%25%2A%20%5CPasses%7B%3AUser%7D%20%2A%29%0A%20%20%20%20%20%20%20schema%3Agender%20%20%20%20%20%20%20%20%20schema%3AFemale%20%3B%0A%20%20%20%20%20%20%20schema%3Aknows%20%20%20%20%20%20%20%20%20%20%3Abob%20.%0A%0A%3Abob%20%20%20schema%3Agender%20%20%20%20%20%20%20%20%20schema%3AMale%20%3B%20%20%20%20%20%20%20%20%23%20%25%2A%20%5CPasses%7B%3AUser%7D%20%2A%29%0A%20%20%20%20%20%20%20schema%3Aname%20%20%20%20%20%20%20%20%20%20%20%22Robert%22%3B%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20schema%3AbirthDate%20%20%20%20%20%20%221980-03-10%22%5E%5Exsd%3Adate%20.%0A%0A%3Acarol%20schema%3Aname%20%20%20%20%20%20%20%20%20%20%20%22Carol%22%20%3B%20%20%20%20%20%20%20%20%20%20%20%20%23%20%25%2A%20%5CPasses%7B%3AUser%7D%20%2A%29%0A%20%20%20%20%20%20%20schema%3Agender%20%20%20%20%20%20%20%20%20%22unspecified%22%20%3B%20%20%0A%20%20%20%20%20%20%20foaf%3Aname%20%20%20%20%20%20%20%20%20%20%20%20%20%22Carol%22%20.%0A%0A%3Adave%20%20schema%3Aname%20%20%20%20%20%20%20%20%20%20%20%22Dave%22%3B%20%20%20%20%20%20%20%20%20%23%20%25%2A%20%5CFails%7B%3AUser%7D%20%2A%29%0A%20%20%20%20%20%20%20schema%3Agender%20%20%20%20%20%20%20%20%20%22XYY%22%3B%20%20%20%20%20%20%20%20%20%20%23%0A%20%20%20%20%20%20%20schema%3AbirthDate%20%20%20%20%20%201980%20.%20%20%20%20%20%20%20%20%20%20%23%20%25%2A%201980%20is%20not%20an%20xsd%3Adate%20%2A%29%0A%0A%3Aemily%20schema%3Aname%20%22Emily%22%2C%20%22Emilee%22%20%3B%20%20%20%20%20%20%20%23%20%25%2A%20%5CFails%7B%3AUser%7D%20%2A%29%0A%20%20%20%20%20%20%20schema%3Agender%20%20%20%20%20%20%20%20%20schema%3AFemale%20.%20%23%20%25%2A%20too%20many%20schema%3Anames%20%2A%29%0A%0A%3Afrank%20foaf%3Aname%20%20%20%20%20%20%20%20%20%20%20%20%20%22Frank%22%20%3B%20%20%20%20%20%20%20%23%20%25%2A%20%5CFails%7B%3AUser%7D%20%2A%29%0A%20%20%20%20%20%20%20schema%3Agender%3A%20%20%20%20%20%20%20%20schema%3AMale%20.%20%20%20%23%20%25%2A%20missing%20schema%3Aname%20%2A%29%0A%0A%3Agrace%20schema%3Aname%20%20%20%20%20%20%20%20%20%20%20%22Grace%22%20%3B%20%20%20%20%20%20%20%23%20%25%2A%20%5CFails%7B%3AUser%7D%20%2A%29%0A%20%20%20%20%20%20%20schema%3Agender%20%20%20%20%20%20%20%20%20schema%3AMale%20%3B%20%20%20%23%20%0A%20%20%20%20%20%20%20schema%3Aknows%20%20%20%20%20%20%20%20%20%20_%3Ax%20.%20%20%20%20%20%20%20%20%20%20%20%23%20%25%2A%20%5C_%3Ax%20is%20not%20an%20IRI%20%2A%29%0A%0A%3Aharold%20schema%3Aname%20%20%20%20%20%20%20%20%20%22Harold%22%20%3B%20%20%20%20%23%20%25%2A%20%5CFails%7B%3AUser%7D%20%2A%29%0A%20%20%20%20%20%20%20%20schema%3Agender%20%20%20%20%20%20%20schema%3AMale%20%3B%20%0A%20%20%20%20%20%20%20%20schema%3Aknows%20%20%20%20%20%20%20%20%3Agrace%20.%20%20%20%20%20%20%23%20%25%2A%20%3Agrace%20does%20not%20conform%20to%20%3AUser%20%2A%29&${API.queryParameters.data.format}=${API.formats.turtle}&${API.queryParameters.schema.schema}=PREFIX%20%3A%20%20%20%20%20%20%20%3Chttp%3A%2F%2Fexample.org%2F%3E%0APREFIX%20schema%3A%20%3Chttp%3A%2F%2Fschema.org%2F%3E%0APREFIX%20xsd%3A%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0A%0A%3AUser%20%7B%0A%20%20schema%3Aname%20%20%20%20%20%20%20%20%20%20xsd%3Astring%20%20%3B%0A%20%20schema%3AbirthDate%20%20%20%20%20xsd%3Adate%3F%20%20%3B%0A%20%20schema%3Agender%20%20%20%20%20%20%20%20%5B%20schema%3AMale%20schema%3AFemale%20%5D%20OR%20xsd%3Astring%20%3B%0A%20%20schema%3Aknows%20%20%20%20%20%20%20%20%20IRI%20%40%3AUser%2A%0A%7D&${API.queryParameters.schema.engine}=${API.engines.shex}&${API.queryParameters.schema.format}=${API.formats.shexc}&${API.queryParameters.shapeMap.shapeMap}=%3Aalice%40%3AUser%2C%3Abob%40%3AUser%2C%3Acarol%40%3AUser%2C%3Aemily%40%3AUser%2C%3Afrank%40%3AUser%2C%3Agrace%40%3AUser%2C%3Aharold%40%3AUser&${API.queryParameters.shapeMap.source}=${API.sources.byText}&${API.queryParameters.shapeMap.format}=${API.formats.compact}`}
              >
                ShEx validation
              </NavDropdown.Item>
              <NavDropdown.Item
                href={`${API.routes.client.shaclValidateRoute}?${API.queryParameters.schema.source}=${API.sources.byText}&${API.queryParameters.data.source}=${API.sources.byText}&${API.queryParameters.data.data}=%40prefix%20%3A%20%20%20%20%20%20%20<http%3A%2F%2Fexample.org%2F>%20.%0A%40prefix%20sh%3A%20%20%20%20%20<http%3A%2F%2Fwww.w3.org%2Fns%2Fshacl%23>%20.%0A%40prefix%20xsd%3A%20%20%20%20<http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23>%20.%0A%40prefix%20schema%3A%20<http%3A%2F%2Fschema.org%2F>%20.%0A%40prefix%20foaf%3A%20%20%20<http%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F>%20.%0A%40prefix%20rdfs%3A%20%20%20<http%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23>%20.%0A%20%20%20%20%20%20%20%20%0A%0A%3Aalice%20a%20%3AUser%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%23%25%2A%5CPasses%7B%3AUserShape%7D%20%2A%29%20%20%20%20%20%0A%20%20%20%20%20%20%20schema%3Aname%20%20%20%20%20%20%20%20%20%20%20"Alice"%20%3B%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20schema%3Agender%20%20%20%20%20%20%20%20%20schema%3AFemale%20%3B%0A%20%20%20%20%20%20%20schema%3Aknows%20%20%20%20%20%20%20%20%20%20%3Abob%20.%0A%0A%3Abob%20%20%20a%20%3AUser%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%23%25%2A%5CPasses%7B%3AUserShape%7D%20%2A%29%20%20%20%20%20%0A%20%20%20%20%20%20%20schema%3Agender%20%20%20%20%20%20%20%20%20schema%3AMale%20%3B%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20schema%3Aname%20%20%20%20%20%20%20%20%20%20%20"Robert"%3B%0A%20%20%20%20%20%20%20schema%3AbirthDate%20%20%20%20%20%20"1980-03-10"%5E%5Exsd%3Adate%20.%0A%0A%3Acarol%20a%20%3AUser%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%23%25%2A%5CPasses%7B%3AUserShape%7D%20%2A%29%20%20%20%20%20%0A%20%20%20%20%20%20%20schema%3Aname%20%20%20%20%20%20%20%20%20%20%20"Carol"%20%3B%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20schema%3Agender%20%20%20%20%20%20%20%20%20schema%3AFemale%20%3B%20%20%0A%20%20%20%20%20%20%20foaf%3Aname%20%20%20%20%20%20%20%20%20%20%20%20%20"Carol"%20.%0A&${API.queryParameters.data.format}=${API.formats.turtle}&${API.queryParameters.data.inference}=${API.inferences.none}&${API.queryParameters.schema.schema}=%40prefix%20%3A%20%20%20%20%20%20%20<http%3A%2F%2Fexample.org%2F>%20.%0A%40prefix%20sh%3A%20%20%20%20%20<http%3A%2F%2Fwww.w3.org%2Fns%2Fshacl%23>%20.%0A%40prefix%20xsd%3A%20%20%20%20<http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23>%20.%0A%40prefix%20schema%3A%20<http%3A%2F%2Fschema.org%2F>%20.%0A%40prefix%20foaf%3A%20%20%20<http%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F>%20.%0A%40prefix%20rdfs%3A%20%20%20<http%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23>%20.%0A%20%20%20%20%20%20%20%20%0A%3AUserShape%20a%20sh%3ANodeShape%3B%0A%20%20%20sh%3AtargetClass%20%3AUser%20%3B%0A%20%20%20sh%3Aproperty%20%5B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%23%20Blank%20node%201%0A%20%20%20%20sh%3Apath%20%20%20%20%20schema%3Aname%20%3B%20%0A%20%20%20%20sh%3AminCount%201%3B%20%0A%20%20%20%20sh%3AmaxCount%201%3B%0A%20%20%20%20sh%3Adatatype%20xsd%3Astring%20%3B%0A%20%20%5D%20%3B%0A%20%20sh%3Aproperty%20%5B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%23%20Blank%20node%202%0A%20%20%20sh%3Apath%20schema%3Agender%20%3B%0A%20%20%20sh%3AminCount%201%3B%0A%20%20%20sh%3AmaxCount%201%3B%0A%20%20%20sh%3Aor%20%28%0A%20%20%20%20%5B%20sh%3Ain%20%28schema%3AMale%20schema%3AFemale%29%20%5D%0A%20%20%20%20%5B%20sh%3Adatatype%20xsd%3Astring%5D%0A%20%20%20%29%0A%20%20%5D%20%3B%0A%20%20sh%3Aproperty%20%5B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%23%20Blank%20node%203%20%20%0A%20%20%20sh%3Apath%20%20%20%20%20schema%3AbirthDate%20%3B%20%0A%20%20%20sh%3AmaxCount%201%3B%20%0A%20%20%20sh%3Adatatype%20xsd%3Adate%20%3B%0A%20%20%5D%20%3B%0A%20%20sh%3Aproperty%20%5B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%23%20Blank%20node%204%20%0A%20%20%20sh%3Apath%20%20%20%20%20schema%3Aknows%20%3B%20%0A%20%20%20sh%3AnodeKind%20sh%3AIRI%20%3B%0A%20%20%20sh%3Aclass%20%20%20%20%3AUser%20%3B%0A%20%20%5D%20.%0A&${API.queryParameters.schema.engine}=${API.engines.shaclex}&${API.queryParameters.schema.format}=${API.formats.turtle}&${API.queryParameters.schema.triggerMode}=${API.triggerModes.targetDecls}`}
              >
                SHACL validation
              </NavDropdown.Item>
              <NavDropdown.Item
                href={`${API.routes.client.endpointQueryRoute}?${API.queryParameters.wbQuery.endpoint}=${API.routes.utils.wikidataUrl}&${API.queryParameters.query.query}=%23 Some subjects of the Marvel Universe%0A%0ASELECT %3Fchar %3FcharName (GROUP_CONCAT(DISTINCT %3FtypeLabel%3Bseparator%3D"%2C ") AS %3Ftypes) (GROUP_CONCAT(DISTINCT %3FuniverseLabel%3Bseparator%3D"%2C ") AS %3Funiverses)%0AWHERE {%0A%20 %3Fchar wdt%3AP1080 wd%3AQ931597%3B%0A%20%20%20%20%20%20%20%20%20 wdt%3AP31 %3Ftype %3B%0A%20%20%20%20%20%20%20%20%20 wdt%3AP1080 %3Funiverse .%0A%20 SERVICE wikibase%3Alabel { bd%3AserviceParam wikibase%3Alanguage "[AUTO_LANGUAGE]%2Cen".%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20 %3Fchar rdfs%3Alabel %3FcharName .%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20 %3Funiverse rdfs%3Alabel %3FuniverseLabel .%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20 %3Ftype rdfs%3Alabel %3FtypeLabel .}%0A} GROUP BY %3Fchar %3FcharName LIMIT 10&${API.queryParameters.query.source}=${API.sources.byText}`}
              >
                Wikidata query
              </NavDropdown.Item>
              <NavDropdown.Item
                href={`${API.routes.client.xmi2ShexRoute}?${API.queryParameters.schema.targetEngine}=${API.engines.shumlex}&${API.queryParameters.schema.targetFormat}=UML%2FXMI&${API.queryParameters.uml.uml}=<%3Fxml version%3D"1.0" encoding%3D"UTF-8"%3F>%0A<uml%3AModel xmi%3Aversion%3D"2.1" xmlns%3Axmi%3D"http%3A%2F%2Fschema.omg.org%2Fspec%2FXMI%2F2.1" xmlns%3Auml%3D"http%3A%2F%2Fwww.eclipse.org%2Fuml2%2F3.0.0%2FUML"%0A xmi%3Aid%3D"kzimxktg" name%3D"ShExGeneratedXMI">%0A<packagedElement xmi%3Atype%3D"uml%3AClass" xmi%3Aid%3D"kzimxktm" name%3D"%3AUser">%0A%09<ownedAttribute xmi%3Aid%3D"kzimxktn" name%3D"schema%3Aname" visibility%3D"public" isUnique%3D"false">%0A%09%09<type xmi%3Atype%3D"uml%3APrimitiveType" href%3D"pathmap%3A%2F%2FUML_LIBRARIES%2FUMLPrimitiveTypes.library.uml%23String">%0A%09%09<%2Ftype>%0A%09<%2FownedAttribute>%0A%09<ownedAttribute xmi%3Aid%3D"kzimxktp" name%3D"schema%3AbirthDate" visibility%3D"public" isUnique%3D"false">%0A%09%09<type xmi%3Atype%3D"uml%3APrimitiveType" href%3D"pathmap%3A%2F%2FUML_LIBRARIES%2FUMLPrimitiveTypes.library.uml%23Date">%0A%09%09<%2Ftype>%0A%09%09<lowerValue xmi%3Atype%3D"uml%3ALiteralInteger" xmi%3Aid%3D"kzimxkto" %2F>%0A%09<%2FownedAttribute>%0A%09<ownedAttribute xmi%3Atype%3D"uml%3AProperty" xmi%3Aid%3D"kzimxktq" name%3D"schema%3Agender" visibility%3D"public" type%3D"kzimxktr" isUnique%3D"true">%0A%09<%2FownedAttribute>%0A%09<ownedAttribute xmi%3Aid%3D"kzimxktq" name%3D"schema%3Agender" visibility%3D"public" isUnique%3D"false">%0A%09%09<type xmi%3Atype%3D"uml%3APrimitiveType" href%3D"pathmap%3A%2F%2FUML_LIBRARIES%2FUMLPrimitiveTypes.library.uml%23String">%0A%09%09<%2Ftype>%0A%09<%2FownedAttribute>%0A%09<ownedAttribute xmi%3Atype%3D"uml%3AProperty" xmi%3Aid%3D"kzimxktu" name%3D"schema%3Aknows" visibility%3D"public" type%3D"kzimxktv" isUnique%3D"true">%0A%09<%2FownedAttribute>%0A%09<ownedAttribute xmi%3Aid%3D"kzimxktx" name%3D"schema%3Aknows" visibility%3D"public" type%3D"kzimxktm" association%3D"kzimxkty" ><%2FownedAttribute>%0A<%2FpackagedElement>%0A<packagedElement xmi%3Atype%3D"uml%3AAssociation" xmi%3Aid%3D"kzimxkty" memberEnd%3D"kzimxktx kzimxktz">%0A%09<ownedEnd xmi%3Aid%3D"kzimxktz" visibility%3D"public" type%3D"kzimxktm" association%3D"kzimxkty"%2F>%0A<%2FpackagedElement>%0A<packagedElement xmi%3Atype%3D"uml%3AEnumeration" xmi%3Aid%3D"kzimxktl" name%3D"Prefixes">%0A%09<ownedLiteral xmi%3Aid%3D"kzimxkth" name%3D"prefix %3A %26lt%3Bhttp%3A%2F%2Fexample.org%2F>"%2F>%0A%09<ownedLiteral xmi%3Aid%3D"kzimxkti" name%3D"prefix schema%3A %26lt%3Bhttp%3A%2F%2Fschema.org%2F>"%2F>%0A%09<ownedLiteral xmi%3Aid%3D"kzimxktj" name%3D"prefix xsd%3A %26lt%3Bhttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23>"%2F>%0A%09<ownedLiteral xmi%3Aid%3D"kzimxktk" name%3D"base %26lt%3Bhttp%3A%2F%2Fexample.org%2F>"%2F>%0A<%2FpackagedElement>%0A<packagedElement xmi%3Atype%3D"uml%3AEnumeration" xmi%3Aid%3D"kzimxktr" name%3D"schema%3Agender">%0A%09<ownedLiteral xmi%3Aid%3D"kzimxku0" name%3D"schema%3AMale"%2F>%0A%09<ownedLiteral xmi%3Aid%3D"kzimxku1" name%3D"schema%3AFemale"%2F>%0A<%2FpackagedElement>%0A<packagedElement xmi%3Atype%3D"uml%3APrimitiveType" xmi%3Aid%3D"kzimxktv" name%3D"IRI"%2F>%0A<%2Fuml%3AModel>&${API.queryParameters.uml.format}=${API.formats.xmi}&${API.queryParameters.uml.source}=${API.sources.byText}`}
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
