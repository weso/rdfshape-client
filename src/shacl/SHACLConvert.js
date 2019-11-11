import React from 'react';
import Container from 'react-bootstrap/Container';
import DataTabs from "../data/DataTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class SHACLConvert extends React.Component {
 render() {
     return (
       <Container>
         <h1>Convert between SHACL formats</h1>
           <Form onSubmit={this.handleSubmit}>
               <DataTabs/>
              <Button variant="primary">Validate</Button>
           </Form>
       </Container>
     );
 }
}

export default SHACLConvert;
