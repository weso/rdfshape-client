import React from 'react';
import Container from 'react-bootstrap/Container';
import DataTabs from "./DataTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class DataConvert extends React.Component {
 render() {
     return (
       <Container>
         <h1>Convert RDF data</h1>
           <Form onSubmit={this.handleSubmit}>
               <DataTabs/>
               <Button variant="primary">Convert data</Button>
           </Form>
       </Container>
     );
 }
}

export default DataConvert;
