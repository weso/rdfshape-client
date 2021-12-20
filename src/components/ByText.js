import PropTypes from "prop-types";
import React from "react";
import Form from "react-bootstrap/Form";
import API from "../API";
import TurtleForm from "../data/TurtleForm";
import ShexForm from "../shex/ShexForm";
import { format2mode } from "../utils/Utils";
import Code from "./Code";

function ByText(props) {
  function handleChange(value) {
    props.handleByTextChange(value);
  }

  // Choose which input component to use regarding the format of the data.
  // Use a generic <Code> element with text by default
  let inputText;

  switch (props.textFormat?.toLowerCase()) {
    case API.formats.turtle.toLowerCase():
      inputText = (
        <TurtleForm
          onChange={props.handleByTextChange}
          fromParams={props.fromParams}
          resetFromParams={props.resetFromParams}
          value={props.textAreaValue}
          options={{ placeholder: props.placeholder, readonly: props.readonly }}
        />
      );
      break;

    case API.formats.shexc.toLowerCase():
      inputText = (
        <ShexForm
          onChange={props.handleByTextChange}
          setCodeMirror={props.setCodeMirror}
          fromParams={props.fromParams}
          resetFromParams={props.resetFromParams}
          value={props.textAreaValue}
          options={{ placeholder: props.placeholder, readonly: props.readonly }}
        />
      );
      break;

    default:
      // no special format, default to <Code> item.
      const mode = format2mode(props.textFormat);
      inputText = (
        <Code
          value={props.textAreaValue}
          mode={mode}
          onChange={handleChange}
          setCodeMirror={props.setCodeMirror}
          placeholder={props.placeholder}
          readonly={props.readonly}
          fromParams={props.fromParams}
          resetFromParams={props.resetFromParams}
        />
      );
      break;
  }

  return (
    <Form.Group>
      <Form.Label>{props.name}</Form.Label>
      {inputText}
    </Form.Group>
  );
}

ByText.propTypes = {
  name: PropTypes.string,
  textAreaValue: PropTypes.string,
  handleByTextChange: PropTypes.func.isRequired,
  setCodeMirror: PropTypes.func,
  placeholder: PropTypes.string,
  textFormat: PropTypes.string,
  importForm: PropTypes.element,
  resetFromParams: PropTypes.func.isRequired,
  fromParams: PropTypes.bool.isRequired,
  readonly: PropTypes.bool,
};

ByText.defaultProps = {
  placeholder: "...",
  readonly: false,
};

export default ByText;
