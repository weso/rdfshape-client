import React from 'react';
import Form from 'react-bootstrap/Form';

class EndpointInput extends React.Component {
    render() {
        return (
            <Form.Group>
                <Form.Label>Endpoint</Form.Label>
                <Form.Control as="input"
                              type="url"
                              placeholder="http://..."
                              onChange={this.props.handleChange}
                />
            </Form.Group>
        );
    }
}

export default EndpointInput;