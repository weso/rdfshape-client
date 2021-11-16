import React, {useState, useEffect} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import CodeMirror from "codemirror/lib/codemirror";
import "codemirror/lib/codemirror.css"
import "codemirror/mode/turtle/turtle"
import "codemirror/mode/xml/xml"
import "codemirror/mode/javascript/javascript"

import PropTypes from "prop-types";
import axios from "axios";
import Form from "react-bootstrap/Form";
import API from "../API"

function RDFArea(props) {
    const [codeMirror,setCodeMirror] = useState(null)

    useEffect(()=> {
        if (!codeMirror) {
        const cm = CodeMirror.fromTextArea(document.getElementById(props.id), {
            lineNumbers: true,
            mode: props.mode,
            viewportMargin: Infinity,
            matchBrackets: true,
        });
        cm.on('change', (cm,change) => {
            props.onChange(cm.getValue())
        });
        cm.setValue(props.value)
        setCodeMirror(cm)
      }
    }, [
        props.mode,
        props.urlFormats,
        props.onChange,
        props.value
    ])

    return <div><textarea id={props.id} /></div>
}

RDFArea.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
}

RDFArea.defaultProps = {
    value: ''
}

function SelectFormat(props) {
  const [format,setFormat] = useState('TURTLE')
  const [formats,setFormats] = useState([])

  function handleFormatChange(e) {
        setFormat(e.target.value)
        props.handleFormatChange(e.target.value);
  }

  useEffect(()=>{
      const url = props.urlFormats;
      axios.get(url)
          .then(response => response.data)
          .then((data) => {
              setFormats(data)
      }).catch((error) => {
          const msg = `Error retrieving formats at url: ${url}\nError: ${error}`
          console.log(msg)
          props.handleError(msg)
      })
  }, [])

  return (<Form.Group>
                <Form.Label>{props.name}</Form.Label>
                <Form.Control as="select" onChange={handleFormatChange}>
                    { formats.map((f,key) => (
                        <option key={key} defaultValue={f === format}>{f}</option>
                    ))
                    }
                </Form.Control>
            </Form.Group>
        )
}

function cnvMode(format) {
    switch (format.toLowerCase()) {
        case 'turtle': return 'turtle';
        case 'rdf/xml': return 'xml';
        case 'rdf/json': return 'javascript'
        case 'json-ld': return 'javascript'
        default: return 'xml'
    }
}

function TestRDFArea(props)  {
    const [defaultFormat,setDefaultFormat] = useState('RDF/XML')
    const [data,setData] = useState('');
    const [dataFormat,setDataFormat] = useState(defaultFormat);
    const [msg,setMsg] = useState('');
    const [mode,setMode] = useState(cnvMode(defaultFormat))

    useEffect(()=>{
        const url = props.urlDefaultFormat;
        axios.get(url)
            .then(response => response.data)
            .then((data) => {
                setDefaultFormat(data)
            }).catch(() => {
                setMsg('Error requesting formats from server at url:  ' . url)
        })
    }, [props.urlDefaultFormat])



    return (
        <div>
            <h1>RDF Area</h1>
            <RDFArea id="textRDFArea"
                     onChange={(value) => setData(value)}
                     mode={mode}
            />
            <br/>
            <SelectFormat name="RDF format"
                          handleFormatChange={(newFormat) => {
                              setDataFormat(newFormat)
                              setMode(cnvMode(newFormat))
                          }}
                          urlFormats={API.dataFormats}
                          urlDefaultFormat={API.formats.defaultData}
                          handleError={(error) => setMsg(`Error from SelectFormat\n${error}`)}
            />
            <Button variant="primary"
                    onClick={() => {
                        setMsg(`RDF Area: ${data}`)
                    }}
                    type="submit">See data</Button>
            <Alert variant="primary">
                <pre>{msg}</pre>
                <br/>
                <p>Format: {dataFormat}</p>
            </Alert>
        </div>
    );
}

export default TestRDFArea;
