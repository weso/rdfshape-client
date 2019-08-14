import React from 'react';
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import EndpointTabs from "./EndpointTabs";
import QueryTabs from "./QueryTabs";


class EndpointQuery extends React.Component {
 render() {
     return (
       <Container>
         <h1>Endpoint info</h1>
           <Form onSubmit={this.handleSubmit}>
               <EndpointTabs />
               <QueryTabs />
               <Button variant="primary">Info about endpoint</Button>
           </Form>
       </Container>
     );
 }
}

export default EndpointQuery;
