import React from 'react';
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import EndpointTabs from "./EndpointInput";

class EndpointExtract extends React.Component {
 render() {
     return (
       <Container fluid={true}>
         <h1>Extract schema from Endpoint node</h1>
           <Form onSubmit={this.handleSubmit}>
              <EndpointTabs/>
              <Button variant="primary">Extract schema from endpoint Node</Button>
           </Form>
       </Container>
     );
 }
}

export default EndpointExtract;
