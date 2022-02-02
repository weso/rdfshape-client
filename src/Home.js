import React from "react";
import Container from "react-bootstrap/Container";
import API from "./API.js";

function Home() {
  return (
    <Container>
      <h1>RDFShape</h1>
      <p>RDFShape is an RDF service where you can play:</p>
      <ul>
        <li>
          <a href="https://www.w3.org/TR/rdf11-concepts/">RDF</a> conversion
          between different formats like{" "}
          <a href="http://www.w3.org/TR/turtle/">Turtle</a> and{" "}
          <a href="http://www.w3.org/TR/json-ld/">JSON-LD</a>
        </li>
        <li>
          RDF validation using <a href="http://shex.io/">ShEx</a> (Shape
          Expressions) and <a href="https://www.w3.org/TR/shacl/">SHACL</a>{" "}
          (Shapes Constraint Language)
        </li>
        <li>
          RDF querying with{" "}
          <a href="http://www.w3.org/TR/sparql11-query/">SPARQL</a>
        </li>
        <li>
          <a href="http://www.w3.org/TR/rdf-schema/">RDFS</a> and{" "}
          <a href="https://www.w3.org/TR/owl2-primer/">OWL</a> inference
        </li>
      </ul>

      <h2>Main tools</h2>
      <p>
        <span className="bold">Data</span> validation and manipulation:
      </p>
      <ul>
        <li>
          Data <a href={API.routes.client.dataInfoRoute}>validation</a> and{" "}
          <a href={API.routes.client.dataConvertRoute}>conversion</a> between
          semantic formats
        </li>
        <li>
          Data{" "}
          <a href={API.routes.client.dataVisualizeCytoscapeRoute}>
            visualization
          </a>
        </li>
        <li>
          Data <a href={API.routes.client.dataQueryRoute}>query</a> via SPARQL
        </li>
      </ul>
      <p>
        <span className="bold">ShEx</span> and{" "}
        <span className="bold">SHACL</span> validation mechanisms:
      </p>
      <ul>
        <li>
          <a href={API.routes.client.shexValidateRoute}>ShEx validation</a> and{" "}
          <a href={API.routes.client.shaclValidateRoute}>SHACL validation</a>
        </li>
        <li>
          ShEx schema{" "}
          <a href={API.routes.client.shexVisualizeUmlRoute}>visualization</a>
        </li>
        <li>
          <a href={API.routes.client.shex2ShaclRoute}>ShEx to SHACL</a> and{" "}
          <a href={API.routes.client.shacl2ShExRoute}>SHACL to ShEx</a>
        </li>
      </ul>
      <p>
        <span className="bold">SPARQL endpoint</span> querying mechanisms:
      </p>
      <ul>
        <li>
          Endpoint <a href={API.routes.client.endpointInfoRoute}>information</a>
        </li>
        <li>
          Endpoint <a href={API.routes.client.endpointQueryRoute}>query</a>
        </li>
      </ul>
    </Container>
  );
}

export default Home;
