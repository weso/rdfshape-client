import React, {useState} from 'react';
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";

function NodeSelector(props) {
    return (
        <Form.Group>
            <Form.Label>Node selector</Form.Label>
            <Form.Control type="text"
                          placeholder={props.placeholder}
                          value={props.value}
                          onChange={(value) => {
                              props.handleChange(value.target.value)
                          }}
            />
        </Form.Group>
    )
}

NodeSelector.propTypes = {
    value: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
};

NodeSelector.defaultProps = {
    placeholder: '<Node>',
};

export default NodeSelector;
