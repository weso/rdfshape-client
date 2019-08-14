import React from 'react';
import Form from "react-bootstrap/Form";
import axios from 'axios';
import ServerHost from "./ServerHost"

class SelectDataFormat extends React.Component {
    state = {
        formats: []
    }

    componentDidMount() {
        const url = ServerHost() + "/api/data/formats";
        axios.get(url).then(response => response.data)
            .then((data) => {
                this.setState({ formats: data })
                console.log(this.state.formats)
            })
    }

    render() {
        const url = ServerHost() + "/api/data/formats"
        return (
            <Form.Group>
            <Form.Label>RDF Data format</Form.Label>
            <Form.Control as="select">
                { this.state.formats.map((format,key) => (
                    <option key={key}>{format}</option>
                 ))
                }
            </Form.Control>
            </Form.Group>
        )
    }
}

export default SelectDataFormat;
