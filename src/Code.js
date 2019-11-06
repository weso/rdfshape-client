import React from 'react';
import {Controlled as CodeMirror} from "react-codemirror2";
import PropTypes from "prop-types";
import 'codemirror/addon/display/placeholder';
import ShExForm from "./ShExForm";
import TurtleForm from "./TurtleForm";

require("codemirror/lib/codemirror.css");
require("codemirror/mode/xml/xml.js");
require("codemirror/mode/turtle/turtle.js");
require("codemirror/mode/sparql/sparql.js");
require("codemirror/mode/javascript/javascript.js");
require("codemirror/theme/midnight.css");

function Code(props) {

    const options = {
        mode: props.mode,
        theme: props.theme,
        lineNumbers: props.linenumbers,
        readonly: props.readonly,
        placeholder: props.placeholder
    };


    let code = null ;
    switch (props.mode.toLowerCase()) {
        case 'shexc': code = <ShExForm value={props.value}
                                       theme={props.theme}
                                       onChange={()=> null}
                                       setCodeMirror = {props.setCodeMirror}
                                       options={options} />;
        break;
        case 'turtle': code = <TurtleForm value={props.value}
                                       theme={props.theme}
                                       onChange={()=> null}
                                       options={options} />;
        break;
        default: code =
            <CodeMirror
             value={props.value}
             options={options}
             onBeforeChange={(_editor, _data, val) => {
                props.onChange(val);
             }}
            />

    }

    return code ;

}

Code.propTypes = {
    value: PropTypes.string,
    mode: PropTypes.string,
    linenumbers: PropTypes.bool,
    readonly: PropTypes.bool,
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