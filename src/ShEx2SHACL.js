import React from 'react';
import Container from 'react-bootstrap/Container';
import ShExTabs from "./ShExTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class ShEx2SHACL extends React.Component {
 render() {
     return (
       <Container>
         <h1>ShEx &#8594; SHACL</h1>
           <Form onSubmit={this.handleSubmit}>
               <ShExTabs/>
              <Button variant="primary">Convert</Button>
           </Form>
       </Container>
     );
 }
}

export default ShEx2SHACL;
