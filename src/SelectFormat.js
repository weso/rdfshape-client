import React from 'react';
import Form from "react-bootstrap/Form";
import axios from 'axios';
import PropTypes from "prop-types";

class SelectFormat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formats: [],
            format: this.props.selectedFormat
        }
        this.handleFormatChange = this.handleFormatChange.bind(this);
    }

    handleFormatChange(e) {
        console.log(e.target.value);
        this.setState({format: e.target.value})
        this.props.handleFormatChange(e.target.value);
    }

    componentDidMount() {
        const url = this.props.urlFormats;
        console.log("Select format URL:" + url);
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
            <Form.Control as="select" onChange={this.handleFormatChange}>
                { this.state.formats.map((format,key) => (
                    <option key={key} defaultValue={format === this.props.defaultFormat}>{format}</option>
                ))
                }
            </Form.Control>
            </Form.Group>
        )
    }
}

SelectFormat.propTypes = {
    name: PropTypes.string.isRequired,
    selectedFormat: PropTypes.string.isRequired,
    handleFormatChange: PropTypes.func.isRequired,
    urlFormats: PropTypes.string.isRequired,
};


export default SelectFormat;
