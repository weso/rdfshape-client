import React from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2'
require("codemirror/lib/codemirror.css");
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/turtle/turtle.js');
require('codemirror/mode/sparql/sparql.js');

function Code(props) {
    return <CodeMirror
        value={props.value}
        options={{
            mode: props.mode,
            theme: props.theme,
            lineNumbers: true
        }}
        onChange={(editor, data, value) => {}}
    />
}

export default Code