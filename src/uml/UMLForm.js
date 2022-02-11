import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import Yashe from "yashe/dist/yashe.bundled.min";
import "yashe/dist/yashe.min.css";
import API from "../API";

function UMLForm(props) {
  const [yashe, setYashe] = useState(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (!yashe) {
      const options = {
        placeholder: props.placeholder,
        readonly: props.readonly,
        mode: API.formats.xml,
        start: { line: 0 },
      };
      const y = Yashe.fromTextArea(textAreaRef.current, options);
      if (props.setCodeMirror) props.setCodeMirror(y);
      y.on("change", (cm, change) => {
        props.onChange(cm.getValue(), y);
      });
      y.setValue(props.value);
      y.refresh();
      setYashe(y);
    } else if (props.fromParams) {
      yashe.setValue(props.value);
      props.resetFromParams();
    }
  }, [
    yashe,
    props.onChange,
    props.placeholder,
    props.fromParams,
    props.resetFromParams,
    props.setCodeMirror,
    props.value,
  ]);

  return <textarea ref={textAreaRef} />;
}

UMLForm.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  readonly: PropTypes.bool,
  fromParams: PropTypes.bool,
  resetFromParams: PropTypes.func,
  setCodeMirror: PropTypes.func,
};

UMLForm.defaultProps = {
  value: "",
  mode: "xml",
  readonly: false,
};

export default UMLForm;
