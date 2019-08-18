import React from 'react';
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import EndpointTabs from "./EndpointInput";

class EndpointInfo extends React.Component {

    render() {
     return (
       <Container fluid={true}>
         <h1>Endpoint info</h1>
           <Form onSubmit={this.handleSubmit}>
               <EndpointTabs/>
              <Button variant="primary" type="submit">Info about endpoint</Button>
           </Form>
       </Container>
     );
 }
}

export default EndpointInfo;
