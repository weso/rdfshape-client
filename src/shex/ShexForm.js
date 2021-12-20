import "codemirror/addon/display/placeholder";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import Yashe from "yashe/dist/yashe.bundled.min";
import "yashe/dist/yashe.min.css";

function ShexForm(props) {
  const [yashe, setYashe] = useState(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    const options = {
      ...props.options,
      start: { line: 0 },
    };
    if (!yashe) {
      const y = Yashe.fromTextArea(textAreaRef.current, options);
      if (props.setCodeMirror) props.setCodeMirror(y);
      y.on("change", (cm, change) => {
        // setQuery(cm.getValue())
        props.onChange(cm.getValue(), y);
        // y.refresh();
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

  return (
    <div>
      <textarea ref={textAreaRef} placeholder={props.placeholder} />
    </div>
  );
}

ShexForm.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  readonly: PropTypes.bool,
  fromParams: PropTypes.bool,
  resetFromParams: PropTypes.func,
  setCodeMirror: PropTypes.func,
};

ShexForm.defaultProps = {
  value: "",
  readonly: false,
};

export default ShexForm;
