import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import PropTypes from "prop-types";

function InputShapeLabel(props) {

    return (
        <div>
           <InputGroup className="mb-3">
                <InputGroup.Prepend><InputGroup.Text id="shapeLabel">Shape</InputGroup.Text></InputGroup.Prepend>
                <FormControl placeholder={props.placeholder} aria-label="Shape" aria-describedby="shapeLabel"
                   value={props.value} onChange={(e) => props.onChange(e.target.value)}
                />
            </InputGroup>
        </div>
    );
}

InputShapeLabel.propTypes = {
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
};

InputShapeLabel.defaultProps = {
    placeholder: 'Shape label'
};

export default InputShapeLabel;
