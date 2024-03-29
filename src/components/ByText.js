import PropTypes from "prop-types";
import React from "react";
import Form from "react-bootstrap/Form";
import API from "../API";
import TurtleForm from "../data/TurtleForm";
import ShexForm from "../shex/ShexForm";
import { format2mode } from "../utils/Utils";
import Code from "./Code";

function ByText(props) {
  // Pre-process the text sent down to the text container
  const textContent = props.fromParams
    ? props.textAreaValue?.trim()
    : props.textAreaValue;

  function handleChange(value, y, change) {
    props.handleByTextChange && props.handleByTextChange(value, y, change);
  }

  const textFormat = props.textFormat?.toLowerCase();

  return (
    <Form.Group>
      {props.name && <Form.Label>{props.name}</Form.Label>}
      {/* Choose which input component to use regarding the format of the data.
      Use a generic <Code> element with text by default */}
      {textFormat == API.formats.turtle.toLowerCase() ? (
        <TurtleForm
          value={textContent}
          onChange={handleChange}
          setCodeMirror={props.setCodeMirror}
          fromParams={props.fromParams}
          resetFromParams={props.resetFromParams}
          options={{ placeholder: props.placeholder, ...props.options }}
        />
      ) : textFormat == API.formats.shexc.toLowerCase() ? (
        <ShexForm
          value={textContent}
          onChange={handleChange}
          setCodeMirror={props.setCodeMirror}
          fromParams={props.fromParams}
          resetFromParams={props.resetFromParams}
          options={{ placeholder: props.placeholder, ...props.options }}
        />
      ) : (
        <Code
          value={textContent}
          mode={format2mode(props.textFormat)}
          onChange={handleChange}
          fromParams={props.fromParams}
          resetFromParams={props.resetFromParams}
          options={{ placeholder: props.placeholder, ...props.options }}
        />
      )}
    </Form.Group>
  );
}

ByText.propTypes = {
  name: PropTypes.string,
  textAreaValue: PropTypes.string,
  handleByTextChange: PropTypes.func,
  setCodeMirror: PropTypes.func,
  placeholder: PropTypes.string,
  textFormat: PropTypes.string,
  importForm: PropTypes.element,
  resetFromParams: PropTypes.func,
  fromParams: PropTypes.bool.isRequired,
  readonly: PropTypes.bool,
  options: PropTypes.object,
};

ByText.defaultProps = {
  placeholder: "...",
  readonly: false,
  fromParams: false,
  options: {},
};

export default ByText;
