import "codemirror/addon/display/placeholder";
import Yate from "perfectkb-yate";
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
        autoCloseTags: true,
        start: { line: 0 },
      };

      const y = Yate.fromTextArea(textAreaRef.current, options);
      y.setOption("placeholder", "My Placeholder");
      y.on("change", (cm, change) => {
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
      <textarea
        id={"Turtle-TextArea"}
        ref={textAreaRef}
        placeholder={props.options.placeholder}
      />
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
