import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ServerHost from "./ServerHost";
import InputTabs from "./InputTabs"
import Form from "react-bootstrap/Form";

class Home extends React.Component {
 render() {
     const infoUrl = ServerHost() + "/data/info"
     return (
       <Container>
         <h1>RDFShape</h1>
           <p>RDFShape is an RDF playground which can be used to play with:</p>
           <ul>
               <li><a href="https://www.w3.org/TR/rdf11-concepts/">RDF</a> conversion between different formats
                   like <a href="http://www.w3.org/TR/turtle/">Turtle</a> and <a href="http://www.w3.org/TR/json-ld/">JSON-LD</a></li>
               <li>RDF validation using <a href="http://shex.io/">ShEx</a> (Shape Expressions) and
                   {' '}
                   <a href="https://www.w3.org/TR/shacl/">SHACL</a> (Shapes Constraint Language)</li>
               <li>RDF querying with <a href="http://www.w3.org/TR/sparql11-query/">SPARQL</a></li>
               <li><a href="http://www.w3.org/TR/rdf-schema/">RDFS</a> and <a href="https://www.w3.org/TR/owl2-primer/">OWL</a> inference</li>
           </ul>
       </Container>
     );
 }
}

export default Home;
