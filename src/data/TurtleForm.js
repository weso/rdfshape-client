import "codemirror/addon/display/placeholder";
import YATE from "perfectkb-yate";
import "perfectkb-yate/dist/yate.css";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";

function TurtleForm(props) {
  const [yate, setYate] = useState(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (!yate) {
      const options = {
        readOnly: "nocursor",
        autoCloseTags: true,
        start: { line: 0 },
        lineNumbers: true,
        lineWrapping: true,
        ...props.options,
      };

      const y = YATE.fromTextArea(textAreaRef.current, options);
      y.on("change", (cm, change) => {
        props.onChange(cm.getValue(), y);
      });
      y.setValue(props.value);
      y.refresh();
      setYate(y);
    } else if (props.fromParams) {
      yate.setValue(props.value);
      props.resetFromParams && props.resetFromParams();
    }
  }, [
    yate,
    props.onChange,
    props.fromParams,
    props.resetFromParams,
    props.options,
    props.value,
  ]);

  return (
    <div>
      <textarea ref={textAreaRef} />
    </div>
  );
}

TurtleForm.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  resetFromParams: PropTypes.func.isRequired,
  fromParams: PropTypes.bool.isRequired,
};

TurtleForm.defaultProps = {
  value: "",
};

export default TurtleForm;
