import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import API from "../API";
import axios from "../utils/networking/axiosConfig";

function SelectFormat(props) {
  const [formats, setFormats] = useState(props.extraOptions);
  const [format, setFormat] = useState(props.selectedFormat);

  const handleFormatChange = (value) => {
    setFormat(value);
    props.handleFormatChange && props.handleFormatChange(value);
  };

  useEffect(() => {
    const fetchFormats = async () => {
      try {
        const serverFormats = props.urlFormats
          ? (await axios.get(props.urlFormats)).data
          : [];
        setFormats([...serverFormats, ...props.extraOptions]);
      } catch (err) {
        console.error(`Could not load formats from server. ${err}`);
      }
    };
    fetchFormats();
  }, [props.urlFormats, props.extraOptions]);

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
  urlFormats: PropTypes.string,
  extraOptions: PropTypes.array,
};

SelectFormat.defaultProps = {
  name: API.texts.selectors.format,
  extraOptions: [],
};

export default SelectFormat;
