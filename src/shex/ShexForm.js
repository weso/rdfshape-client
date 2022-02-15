import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import YASHE from "yashe/dist/yashe.bundled.min";
import "yashe/dist/yashe.min.css";
import "../utils/yashe/placeholder-fix";

function ShexForm(props) {
  const [yashe, setYashe] = useState(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    const options = {
      readOnly: true,
      autoCloseTags: true,
      start: { line: 0 },
      lineNumbers: true,
      lineWrapping: true,
      ...props.options,
    };

    if (!yashe) {
      const y = YASHE.fromTextArea(textAreaRef.current, options);
      if (props.setCodeMirror) props.setCodeMirror(y);
      y.on("change", (cm, change) => {
        props.onChange && props.onChange(cm.getValue(), cm, change);
      });
      props.value && y.setValue(props.value);
      y.refresh();
      setYashe(y);
    } else if (props.fromParams) {
      yashe.setValue(props.value);
      props.resetFromParams && props.resetFromParams();
    }
  }, [
    yashe,
    props.onChange,
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
};

export default ShexForm;
