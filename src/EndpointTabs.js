import React from 'react';
import Form from 'react-bootstrap/Form';

class EndpointTabs extends React.Component {
    render() {
        return (
            <Form.Group>
                <Form.Label>Endpoint</Form.Label>
                <Form.Control as="input" type="text" placeholder="http://..." />
            </Form.Group>
        );
    }
}

export default EndpointTabs;