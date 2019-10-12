import React, {useState} from 'react';
import Code from "../Code";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";

function TestCode(props) {

    const rdf = 'prefix : <http://example.org/>';
    const [code,setCode] = useState(rdf);
    const [mode,setMode] = useState('turtle');
    const [theme,setTheme] = useState('default');

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
                  mode={mode}
                  onChange={handleChange}
                  readonly={false}
                  theme={theme}
                  value={code} />

   <Dropdown>
   <Dropdown.Toggle variant="success" id="dropdown-basic">Change mode</Dropdown.Toggle>
   <Dropdown.Menu>
    <Dropdown.Item onSelect={(key,event) => { setMode('turtle')} }>Turtle</Dropdown.Item>
    <Dropdown.Item onSelect={(key,event) => { setMode('javascript')} }>Javascript</Dropdown.Item>
    <Dropdown.Item onSelect={(key,event) => { setMode('xml')} }>XML</Dropdown.Item>
   </Dropdown.Menu>
  </Dropdown>
  <Dropdown>
  <Dropdown.Toggle variant="success" id="dropdown-basic">Change theme</Dropdown.Toggle>
   <Dropdown.Menu>
    <Dropdown.Item onSelect={(key,event) => { setTheme('default')} }>Default</Dropdown.Item>
    <Dropdown.Item onSelect={(key,event) => { setTheme('midnight')} }>Midnight</Dropdown.Item>
   </Dropdown.Menu>
  </Dropdown>      

        </Container>
    );
}

export default TestCode;
