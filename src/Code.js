import React, {useState} from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2'
import PropTypes from "prop-types";
import DataTabs from "./DataTabs";
require("codemirror/lib/codemirror.css");
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/turtle/turtle.js');
require('codemirror/mode/sparql/sparql.js');

function Code(props) {

    const [code,setCode] = useState(props.value);

    function updateCode(value) { setCode(value); }

    return <CodeMirror
        value={code}
        options={{
            mode: props.mode,
            theme: props.theme,
            lineNumbers: props.linenumbers,
            readonly: props.readonly
        }}
        onChange={updateCode}
    />
}

Code.propTypes = {
    value: PropTypes.string,
    mode: PropTypes.string,
    linenumbers: PropTypes.bool,
    readonly: PropTypes.bool,
    theme: PropTypes.string
};

Code.defaultProps = {
    mode: 'turtle',
    value: '',
    theme: 'default',
    linenumbers: true,
    readonly: true
};

export default Code