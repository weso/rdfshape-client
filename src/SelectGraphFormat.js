import React from 'react';
import Form from "react-bootstrap/Form";
import axios from 'axios';
import API from "./API"

class SelectGraphFormat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formats: [],
            selected: this.props.default
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({selected: e.target.value})
        this.props.handleChange(e.target.value);
    }

    componentDidMount() {
        const url = API.dataVisualFormats;
        axios.get(url).then(response => response.data)
            .then((data) => {
                this.setState({ formats: data })
                console.log(this.state.formats)
            })
    }

    render() {
        return (
            <Form.Group>
            <Form.Label>{this.props.name}</Form.Label>
            <Form.Control as="select" onChange={this.handleChange}>
                { this.state.formats.map((format,key) => (
                    <option key={key}>{format}</option>
                 ))
                }
            </Form.Control>
            </Form.Group>
        )
    }
}

export default SelectGraphFormat;
