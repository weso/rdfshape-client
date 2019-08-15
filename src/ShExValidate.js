import React from 'react';
import Container from 'react-bootstrap/Container';
import DataTabs from "./DataTabs"
import ShExTabs from "./ShExTabs"
import ShapeMapTabs from "./ShapeMapTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class ShExValidate extends React.Component {
 render() {
     return (
       <Container fluid={true}>
         <h1>Validate RDF data with ShEx</h1>
           <Form onSubmit={this.handleSubmit}>
               <DataTabs/>
               <ShExTabs/>
               <ShapeMapTabs/>
              <Button variant="primary">Validate</Button>
           </Form>
       </Container>
     );
 }
}

export default ShExValidate;
