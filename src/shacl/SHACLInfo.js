import React from 'react';
import Container from 'react-bootstrap/Container';
import SHACLTabs from "./SHACLTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class SHACLInfo extends React.Component {
 render() {
     return (
       <Container>
         <h1>Info about SHACL schema</h1>
           <Form onSubmit={this.handleSubmit}>
               <SHACLTabs/>
              <Button variant="primary">Get Info</Button>
           </Form>
       </Container>
     );
 }
}

export default SHACLInfo;
