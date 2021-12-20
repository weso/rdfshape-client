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
  const [theme, setTheme] = useState(props.theme);
  const [editor, setEditor] = useState(null);
  const options = {
    mode: props.mode,
    theme: theme,
    lineNumbers: props.linenumbers,
    lineWrapping: true,
    readOnly: props.readOnly,
    placeholder: props.placeholder,
    autoCloseTags: true,
  };

  useEffect(() => {
    if (editor) {
      if (props.fromParams) {
        editor.setValue(props.value);
        props.resetFromParams();
      }
    }
  }, [props.value, props.fromParams, props.resetFromParams]);

  let code = null;
  switch (props.mode.toLowerCase()) {
    default:
      code = (
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

  return code;
}

Code.propTypes = {
  value: PropTypes.string,
  mode: PropTypes.string,
  linenumbers: PropTypes.bool,
  readOnly: PropTypes.bool,
  theme: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

Code.defaultProps = {
  mode: "turtle",
  value: "",
  theme: "default",
  linenumbers: true,
  readonly: true,
};

export default Code;
