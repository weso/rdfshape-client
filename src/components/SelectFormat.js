// import {Typeahead, Token} from 'react-bootstrap-typeahead';
import axios from 'axios';
import PropTypes from "prop-types";
import React, { useEffect, useState } from 'react';
import Form from "react-bootstrap/Form";

function SelectFormat(props) {
    const [formats,setFormats] = useState([]);
    const [format,setFormat] = useState(props.selectedFormat);

    useEffect(() => {
        const url = props.urlFormats;
        axios.get(url).then(response => response.data)
            .then((data) => {
                setFormats(data)
                //console.log(`Formats: ${formats}`)
            })
    }, [props.urlFormats]);

    useEffect(() => {
        setFormat(props.selectedFormat)
        props.handleFormatChange(props.selectedFormat)
    }, [props.selectedFormat])

    function handleFormatChange(e) {
        setFormat(e.target.value)
        props.handleFormatChange(e.target.value);
    }

    return (
            <Form.Group>
            <Form.Label>{props.name}</Form.Label>
            <Form.Control as="select" onChange={handleFormatChange} value={format}>
                { formats.map((f,key) => (
                    <option key={key} defaultValue={f === format}>{f}</option>
                ))
            }
            </Form.Control>
            </Form.Group>
    )
}

SelectFormat.propTypes = {
    name: PropTypes.string.isRequired,
    selectedFormat: PropTypes.string.isRequired,
    handleFormatChange: PropTypes.func.isRequired,
    urlFormats: PropTypes.string.isRequired,
};

SelectFormat.defaultProps = {
    name: 'Format'
};


export default SelectFormat;
