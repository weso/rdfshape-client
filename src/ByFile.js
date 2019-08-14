import React from 'react';
import Form from "react-bootstrap/Form";

class ByFile extends React.Component {

 render() {
     return (
        <Form.Group>
         <Form.Control as="input" type="file" />
        </Form.Group>
     );
 }
}

export default ByFile;
