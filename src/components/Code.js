import React, { useState, useEffect} from 'react';
import {Controlled as CodeMirror} from "react-codemirror2";
import 'codemirror/theme/material.css';
import 'codemirror/theme/midnight.css';

import PropTypes from "prop-types";
import 'codemirror/addon/display/placeholder';
// import ShExForm from "../shex/ShExForm";
// import TurtleForm from "../data/TurtleForm";

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/mode/htmlmixed/htmlmixed';
import "codemirror/mode/turtle/turtle.js";
import 'codemirror/mode/sparql/sparql.js';
import 'codemirror/mode/javascript/javascript.js';
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

const ThemeList = [ "default", "material", "midnight" ];
const DefaultTheme = "default"

function Code(props) {
    const [theme, setTheme] = useState(props.theme);
    const [editor, setEditor] = useState(null);
    const options = {
        mode: props.mode,
        theme: theme,
        lineNumbers: props.linenumbers,
        readOnly: props.readOnly,
        placeholder: props.placeholder
    };

    useEffect(() => {
      if (editor) {
          if (props.fromParams) {
              editor.setValue(props.value);
              props.resetFromParams();
          }
      }
    }, [props.value, props.fromParams, props.resetFromParams]);



    let code = null ;
    switch (props.mode.toLowerCase()) {
       /* case 'shexc': code = <ShExForm value={props.value}
                                       theme={props.theme}
                                       onChange={()=> null}
                                       options={options}
                                       fromParams={props.fromParams}
                                       resetFromParams={props.resetFromParams}
        />;
        break;
        case 'turtle': code = <TurtleForm value={props.value}
                                       theme={props.theme}
                                       onChange={()=> null}
                                       options={options}
                                       fromParams={props.fromParams}
                                       resetFromParams={props.resetFromParams}
        />;
        break; */
        default: code =
           <React.Fragment>
            <CodeMirror
             value={props.value}
             options={options}
             onBeforeChange={(_editor, _data, val) => {
                props.onChange(val);
             }}
             editorDidMount={editor => { setEditor(editor) }}
            />
               <DropdownButton id="dropdown-basic-button" title="Theme" variant="secondary">
                   { ThemeList.map((t) =>
                       <Dropdown.Item onSelect={() => setTheme(t)}
                           // href={setTheme(t)}
                       >
                       {t}
                      </Dropdown.Item>
                   )}
               </DropdownButton>
           </React.Fragment>

               }

    return code ;

}

Code.propTypes = {
    value: PropTypes.string,
    mode: PropTypes.string,
    linenumbers: PropTypes.bool,
    readOnly: PropTypes.bool,
    theme: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string
};

Code.defaultProps = {
    mode: 'turtle',
    value: '',
    theme: 'default',
    linenumbers: true,
    readonly: true
};

export default Code