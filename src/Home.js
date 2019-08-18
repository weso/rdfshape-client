import React from 'react';
import Container from 'react-bootstrap/Container';

class Home extends React.Component {
 render() {
     return (
       <Container>
         <h1>RDFShape</h1>
           <p>RDFShape is an RDF service where you can play:</p>
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
