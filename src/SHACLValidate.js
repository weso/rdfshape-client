import React from 'react';
import Container from 'react-bootstrap/Container';
import DataTabs from "./DataTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function SHACLValidate(props) {
  return (
    <Container>
     <h1>Validate RDF data with SHACL</h1>
       <Form onSubmit={this.handleSubmit}>
        <DataTabs/>
        <Button variant="primary">Validate</Button>
       </Form>
    </Container>
 );
}

export default SHACLValidate;
