import PropTypes from "prop-types";
import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import Form from "react-bootstrap/Form";
import API from "../API";

function NodeSelector({
  options,
  selected,
  placeholder,
  handleChange,
  handleInputChange,
}) {
  return (
    <Form.Group>
      <Form.Label>{API.texts.dataTabs.nodeSelectorHeader}</Form.Label>
      {/* Typeahead */}
      <Typeahead
        allowNew={true} // Allow user custom nodes
        id="node-selector"
        multiple={false}
        newSelectionPrefix={`${API.texts.useNodeSelector}: `}
        options={options}
        maxResults={10}
        selected={selected} // Control from parent
        placeholder={placeholder}
        onChange={handleChange} // Change in selection
        onInputChange={handleInputChange} // Change by manually typing
      />
      {/* Raw text */}
      {/* <Form.Control
        type="text"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(value) => {
          props.handleChange(value.target.value);
        }}
      /> */}
    </Form.Group>
  );
}

NodeSelector.propTypes = {
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

NodeSelector.defaultProps = {
  options: [],
  placeholder: API.texts.placeholders.nodeSelector,
  handleChange: () => {},
  handleInputChange: () => {},
};

export default NodeSelector;
