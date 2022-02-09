import "codemirror/addon/display/placeholder";
import "codemirror/addon/edit/closetag";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/sparql/sparql.js";
import "codemirror/mode/turtle/turtle.js";
import "codemirror/mode/xml/xml.js";
import "codemirror/theme/material.css";
import "codemirror/theme/midnight.css";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";

const ThemeList = ["default", "material", "midnight"];
const DefaultTheme = "default";

function Code(props) {
  const [editor, setEditor] = useState(null);

  const options = {
    mode: "turtle",
    theme: "default",
    lineNumbers: true,
    readOnly: true,
    lineWrapping: true,
    autoCloseTags: true,
    ...props.options, // Override defaults with user settings when necessary
  };

  useEffect(() => {
    if (editor) {
      if (props.fromParams) {
        editor.setValue(props.value);
        props.resetFromParams && props.resetFromParams();
      }
    }
  }, [props.value, props.fromParams, props.resetFromParams]);

  return (
    <React.Fragment>
      <CodeMirror
        value={props.value}
        options={options}
        onBeforeChange={(_editor, _data, val) => {
          props.onChange(val);
        }}
        editorDidMount={(editor) => {
          setEditor(editor);
        }}
      />
    </React.Fragment>
  );
}

Code.propTypes = {
  value: PropTypes.string,
  options: PropTypes.object,
  onChange: PropTypes.func,
  fromParams: PropTypes.bool,
  resetFromParams: PropTypes.func,
};

Code.defaultProps = {
  value: "",
  fromParams: false,
  resetFromParams: () => {},
};

export default Code;
