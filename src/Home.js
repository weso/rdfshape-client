import React from "react";
import Container from "react-bootstrap/Container";

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
          Data <a href="/dataInfo">validation</a> and{" "}
          <a href="/dataConvert">conversion</a> between semantic formats
        </li>
        <li>
          Data <a href="/dataVisualize">visualization</a>
        </li>
        <li>
          Data <a href="/dataQuery">query</a> via SPARQL
        </li>
      </ul>
      <p>
        <span className="bold">ShEx</span> and{" "}
        <span className="bold">SHACL</span> validation mechanisms:
      </p>
      <ul>
        <li>
          <a href="/shexValidate">ShEx validation</a> and{" "}
          <a href="/shaclValidate">SHACL validation</a>
        </li>
        <li>
          ShEx schema <a href="/shExVisualize">visualization</a>
        </li>
        <li>
          <a href="/shEx2Shacl">ShEx to SHACL</a> and{" "}
          <a href="/shacl2ShEx">SHACL to ShEx</a>
        </li>
      </ul>
      <p>
        <span className="bold">SPARQL endpoint</span> querying mechanisms:
      </p>
      <ul>
        <li>
          Endpoint <a href="/endpointInfo">information</a>
        </li>
        <li>
          Endpoint <a href="/endpointQuery">query</a>
        </li>
      </ul>
    </Container>
  );
}

export default Home;
