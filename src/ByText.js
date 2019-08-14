import React from 'react';
import Form from "react-bootstrap/Form";

class ByText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'RDF data...'
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        alert('An essay was submitted: ' + this.state.value);
        event.preventDefault();
    }

 render() {
     return (
        <Form.Group>
         <Form.Label>{this.props.name}</Form.Label>
         <Form.Control as="textarea" rows="3" value={this.state.value} onChange={this.handleChange} />
        </Form.Group>
     );
 }
}


export default ByText;
