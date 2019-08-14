import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';

class About extends React.Component {
 render() {
     return (
       <Container>
         <h1>About RDFShape</h1>
         <p>Author: <a href="http://labra.weso.es">Jose Emilio Labra Gayo</a></p>
       </Container>
     );
 }
}

export default About;
