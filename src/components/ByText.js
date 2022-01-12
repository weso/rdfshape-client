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
    props.handleByTextChange && props.handleByTextChange(value);
  }

  const textFormat = props.textFormat?.toLowerCase();

  return (
    <Form.Group>
      <Form.Label>{props.name}</Form.Label>
      {/* Choose which input component to use regarding the format of the data.
      Use a generic <Code> element with text by default */}
      {textFormat == API.formats.turtle.toLowerCase() ? (
        <TurtleForm
          onChange={handleChange}
          engine={props.textEngine}
          fromParams={props.fromParams}
          resetFromParams={props.resetFromParams}
          value={props.textAreaValue}
          options={{ placeholder: props.placeholder, readOnly: props.readonly }}
        />
      ) : textFormat == API.formats.shexc.toLowerCase() ? (
        <ShexForm
          onChange={handleChange}
          setCodeMirror={props.setCodeMirror}
          fromParams={props.fromParams}
          resetFromParams={props.resetFromParams}
          value={props.textAreaValue}
          options={{ placeholder: props.placeholder, readonly: props.readonly }}
        />
      ) : (
        <Code
          value={props.textAreaValue}
          mode={format2mode(props.textFormat)}
          onChange={handleChange}
          setCodeMirror={props.setCodeMirror}
          placeholder={props.placeholder}
          readonly={props.readonly}
          fromParams={props.fromParams}
          resetFromParams={props.resetFromParams}
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
};

ByText.defaultProps = {
  placeholder: "...",
  readonly: false,
  fromParams: false,
};

export default ByText;
