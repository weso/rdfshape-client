import React from "react";
import Container from "react-bootstrap/Container";
import API from "./API.js";

function Home() {
  return (
    <Container>
      <h1>RDFShape</h1>
      <p>
        RDFShape is a playground for RDF data conversion, validation and
        visualization, among other features. 
      </p>
      <p>It supports the following tasks:</p>
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
      <p>
        You may jump straight in or check the examples in the navbar yourself :)
      </p>

      <h2>Main tools</h2>
      <p>
        <span className="bold">Data</span> validation and manipulation:
      </p>
      <ul>
        <li>
          Data <a href={API.routes.client.dataInfoRoute}>analysis</a> and
          visualization
        </li>
        <li>
          Data <a href={API.routes.client.dataConvertRoute}>conversion</a>{" "}
          between semantic formats
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
          <a href={API.routes.client.shexInfoRoute}>ShEx</a> and{" "}
          <a href={API.routes.client.shaclInfoRoute}>SHACL</a> analysis and
          visualization
        </li>
        <li>
          <a href={API.routes.client.shexValidateRoute}>ShEx</a> and{" "}
          <a href={API.routes.client.shaclValidateRoute}>SHACL</a> data
          validation
        </li>
        <li>
          <a href={API.routes.client.shexConvertRoute}>ShEx</a> and{" "}
          <a href={API.routes.client.shaclConvertRoute}>SHACL</a> schema
          conversions
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
        <li>
          Check out <a href={API.routes.utils.wikishape}>WikiShape</a> for more
        </li>
      </ul>
    </Container>
  );
}

export default Home;
