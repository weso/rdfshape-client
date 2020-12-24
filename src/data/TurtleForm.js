import Yate from "perfectkb-yate/dist/yate.bundled.js";
import "perfectkb-yate/dist/yate.css";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";

function TurtleForm(props) {
  const [yate, setYate] = useState(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (!yate) {
      const options = {
        ...props.options,
        placeholder: props.placeholder,
        start: { line: 0 },
      };
      const y = Yate.fromTextArea(textAreaRef.current, options);
      y.on("change", (cm, change) => {
        // setQuery(cm.getValue())
        props.onChange(cm.getValue(), y);
      });
      y.setValue(props.value);
      y.refresh();
      setYate(y);
    } else {
      if (props.options) {
        yate.setOption("readOnly", props.options.readOnly);
      }
      if (props.fromParams) {
        yate.setValue(props.value);
        if (props.resetFromParams) {
          props.resetFromParams();
        } else {
          console.error(`resetFromParams is not a function...`);
        }
      }
    }
  }, [
    yate,
    props.onChange,
    props.placeholder,
    props.fromParams,
    props.resetFromParams,
    props.options,
    props.value,
  ]);

  return (
    <div>
      <textarea id={"Turtle-TextArea"} ref={textAreaRef} />
    </div>
  );
}

TurtleForm.propTypes = {
  //    id: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  //    options: PropTypes.object ,
  resetFromParams: PropTypes.func.isRequired,
  fromParams: PropTypes.bool.isRequired,
};

TurtleForm.defaultProps = {
  value: "",
};

export default TurtleForm;
