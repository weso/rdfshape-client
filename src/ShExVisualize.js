import React from 'react';
import Container from 'react-bootstrap/Container';
import ShExTabs from "./ShExTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class ShExVisualize extends React.Component {
 render() {
     return (
       <Container>
         <h1>Visualize ShEx schema</h1>
           <Form onSubmit={this.handleSubmit}>
               <ShExTabs/>
              <Button variant="primary">Visualize</Button>
           </Form>
       </Container>
     );
 }
}

export default ShExVisualize;
