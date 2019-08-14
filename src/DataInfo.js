import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

class DataInfo extends React.Component {
 render() {
     return (
       <Container>
         <h1>RDF Data info</h1>
           <p><b>{process.env.NODE_ENV}</b></p>
           <p>HOST: {process.env.REACT_APP_RDFSHAPE_HOST}</p>
           console.log("Hola");
         <form action={process.env.REACT_APP_RDFSHAPE_HOST}>
         <textarea>
             Hooola
         </textarea>
         <Button variant="primary">Primary</Button>
         </form>
       </Container>
     );
 }
}

export default DataInfo;
