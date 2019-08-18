import React from 'react';
import Form from "react-bootstrap/Form";

class NodeSelector extends React.Component {

 render() {
     return (
        <Form.Group>
         <Form.Label>Node selector</Form.Label>
         <Form.Control type="text" placeholder={this.props.placeholder} />
        </Form.Group>
     );
 }
}

export default NodeSelector;
