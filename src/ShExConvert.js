import React from 'react';
import Container from 'react-bootstrap/Container';
import ShExTabs from "./ShExTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class ShExConvert extends React.Component {
 render() {
     return (
       <Container>
         <h1>Convert ShEx formats</h1>
           <Form onSubmit={this.handleSubmit}>
               <ShExTabs/>
              <Button variant="primary">Convert</Button>
           </Form>
       </Container>
     );
 }
}

export default ShExConvert;
