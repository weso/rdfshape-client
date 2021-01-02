import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import Yashe from "@weso/yashe";
import "@weso/yashe/dist/yashe.min.css";

function ShExForm(props) {
  const [yashe, setYashe] = useState(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (!yashe) {
      const options = {
        placeholder: props.placeholder,
        readonly: props.readonly,
        start: { line: 0 },
      };

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
      <textarea ref={textAreaRef} />
    </div>
  );
}

ShExForm.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  readonly: PropTypes.bool,
  fromParams: PropTypes.bool,
  resetFromParams: PropTypes.func,
  setCodeMirror: PropTypes.func,
};

ShExForm.defaultProps = {
  value: "",
  readonly: false,
};

export default ShExForm;
