import React, {useState} from 'react';
import Code from "../Code";
import Container from "react-bootstrap/Container";
import {Controlled as CodeMirror} from "react-codemirror2";

function TestCode(props) {

    const rdf = 'prefix : <http://example.org/>';
    const [code,setCode] = useState(rdf);

    function handleChange(value) {
       setCode(value);
    }


    const options = {
        mode: 'turtle',
        theme: 'default',
        lineNumbers: true,
        readonly: false
    }

    return (
        <Container>
{/*
            <CodeMirror
                value={code}
                options={options}
                onBeforeChange={(editor, data, val) => {
                    console.log(`onBeforeChange: ${val}`);
                    setCode(val);
                }}
            />
*/}

            <Code linenumbers={true}
                  mode='turtle'
                  onChange={handleChange}
                  readonly={false}
                  theme='default'
                  value={code} />

        </Container>
    );
}

export default TestCode;
