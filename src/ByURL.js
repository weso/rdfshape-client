import React from 'react';
import Form from "react-bootstrap/Form";

class ByURL extends React.Component {

 render() {
     return (
        <Form.Group>
         <Form.Label>{this.props.name}</Form.Label>
         <Form.Control type="text" placeholder={this.props.placeholder} />
        </Form.Group>
     );
 }
}

export default ByURL;
