// import {Typeahead, Token} from 'react-bootstrap-typeahead';
import axios from "axios";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";

function SelectFormat(props) {
  const [formats, setFormats] = useState([]);
  const [format, setFormat] = useState(props.selectedFormat);

  const handleFormatChange = (value) => {
    setFormat(value);
    props.handleFormatChange && props.handleFormatChange(value);
  };

  useEffect(() => {
    const url = props.urlFormats;
    axios
      .get(url)
      .then((response) => response.data)
      .then((data) => {
        setFormats(data);
      })
      .catch(() => console.error("Could not load formats from server"));
  }, [props.urlFormats]);

  useEffect(() => {
    if (!props.selectedFormat || formats.length == 0) return;
    // Make the UI format selector ignore the case of the incoming format argument
    const newFormat = formats.find(
      (format) => format.toLowerCase() === props.selectedFormat.toLowerCase()
    );
    handleFormatChange(newFormat);
  }, [props.selectedFormat, formats]);

  return (
    <Form.Group>
      <Form.Label>{props.name}</Form.Label>
      <Form.Control
        as="select"
        onChange={(e) => handleFormatChange(e.target.value)}
        value={format}
      >
        {formats.map((format, key) => (
          <option key={key} defaultValue={format === format}>
            {format}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
}

SelectFormat.propTypes = {
  name: PropTypes.string.isRequired,
  selectedFormat: PropTypes.string.isRequired,
  handleFormatChange: PropTypes.func.isRequired,
  urlFormats: PropTypes.string.isRequired,
};

SelectFormat.defaultProps = {
  name: "Format",
};

export default SelectFormat;
