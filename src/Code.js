import React, {useState} from 'react';
import ReactDOM from "react-dom";
import {Controlled as CodeMirror} from "react-codemirror2";
import PropTypes from "prop-types";
import 'codemirror/addon/display/placeholder';

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

    console.log(`<Code props.mode: ${props.mode}>`);

    return <CodeMirror
        value={props.value}
        options={options}
        onBeforeChange={(_editor, _data, val) => {
            props.onChange(val);
        }}
    />
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