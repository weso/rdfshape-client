import React from 'react';
import Container from 'react-bootstrap/Container';
import SHACLTabs from "./SHACLTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class SHACL2ShEx extends React.Component {
 render() {
     return (
       <Container>
         <h1>SHACL &#8594; ShEx</h1>
           <Form onSubmit={this.handleSubmit}>
               <SHACLTabs/>
              <Button variant="primary">Convert</Button>
           </Form>
       </Container>
     );
 }
}

export default SHACL2ShEx;
