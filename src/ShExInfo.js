import React from 'react';
import Container from 'react-bootstrap/Container';
import ShExTabs from "./ShExTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class ShExInfo extends React.Component {
 render() {
     return (
       <Container>
         <h1>Info about ShEx schema</h1>
           <Form onSubmit={this.handleSubmit}>
               <ShExTabs/>
              <Button variant="primary">Info</Button>
           </Form>
       </Container>
     );
 }
}

export default ShExInfo;
