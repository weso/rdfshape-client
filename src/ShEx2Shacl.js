import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import ShExTabs from "./ShExTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Pace from "react-pace-progress";
import ResultShEx2Shacl from "./results/ResultShEx2Shacl";
import {mkPermalink, params2Form, Permalink} from "./Permalink";
import API from "./API";
import SelectFormat from "./SelectFormat";
import qs from "query-string";
import {convertTabSchema, shExParamsFromQueryParams} from "./Utils";
import axios from "axios";

export default function ShEx2Shacl(props)  {
    const url = API.schemaConvert;

    const [result,setResult] = useState('');
    const [permalink,setPermalink] = useState(null);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);
    const [shExTextArea,setShExTextArea] = useState('');
    const [shExFormat, setShExFormat] = useState(API.defaultShExFormat);
    const [shExUrl, setShExUrl] = useState('');
    const [shExFile, setShExFile] = useState(null);
    const [shExActiveTab,setShExActiveTab] = useState(API.defaultTab);
    const [targetFormat, setTargetFormat] = useState('');

    const handleShExTabChange = (value) => { setShExActiveTab(value); };
    function handleShExFormatChange(value) { setShExFormat(value); }
    function handleShExByTextChange(value) { setShExTextArea(value); }
    function handleShExUrlChange(value) { setShExUrl(value); }
    function handleShExFileUpload(value) { setShExFile(value); }

    useEffect(() => {
        console.log("Use Effect - shEx2Shacl");
        if (props.location.search) {
            const queryParams = qs.parse(props.location.search);
            console.log("Parameters: " + JSON.stringify(queryParams));
            let params =  shExParamsFromQueryParams(queryParams);
            const formData = params2Form(params);
            postRequest(url, formData, () => updateState(params))
        }
    });

    function updateState(params) {
        if (params['shEx']) {
            setShExActiveTab(API.byTextTab);
            setShExTextArea(params['shEx'])
        }
        if (params['shExFormat']) setShExFormat(params['shExFormat']);
        if (params['shExUrl']) {
            setShExActiveTab(API.byUrlTab);
            setShExUrl(params['shExUrl']);
        }
        if (params['shExFile']) {
            setShExActiveTab(API.byFileTab);
            setShExFile(params['shExFile']);
        }
        if (params['targetFormat']) setTargetFormat(params['targetFormat']);
    }

    function paramsFromStateShEx() {
        let params = {};
        params['activeSchemaTab'] = convertTabSchema(shExActiveTab);
        params['schemaEmbedded'] = false;
        params['schemaFormat'] = shExFormat;
        switch (shExActiveTab) {
            case API.byTextTab:
                params['schema'] = shExTextArea;
                params['schemaFormatTextArea'] = shExFormat;
                break;
            case API.byUrlTab:
                params['schemaURL'] = shExUrl;
                params['schemaFormatUrl'] = shExFormat;
                break;
            case API.byFileTab:
                params['schemaFile'] = shExFile;
                params['schemaFormatFile'] = shExFormat;
                break;
            default:
        }
        params['targetFormat'] = targetFormat;
        return params;
    }

    function handleSubmit(event) {
        let params = paramsFromStateShEx();
        params['schemaEngine']='ShEx';
        let formData = params2Form(params);
        let permalink = mkPermalink(API.shEx2ShaclRoute, params);
        setLoading(true);
        setPermalink(permalink);
        postRequest(url,formData);
        event.preventDefault();
    }

    function postRequest(url, formData, cb) {
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                setLoading(false);
                setResult(data);
                if (cb) cb()
            })
            .catch(function (error) {
                setLoading(false);
                setError(`Error doing POST request to ${url}: ${error}`);
                console.log('Error doing server request');
                console.log(error);
            });
    }

    function targetFormatMode(targetFormat) {
        switch (targetFormat.toUpperCase()) {
            case 'TURTLE': return 'turtle';
            case 'RDF/XML': return 'xml';
            case 'TRIG': return 'xml';
            case 'JSON-LD': return 'javascript'
            default: return 'turtle'
        }
    }

    return  (
      <Container fluid={true}>
          <h1>Convert ShEx &#8594; SHACL</h1>
          <Form onSubmit={handleSubmit}>
              {loading ? <Pace color="#27ae60"/> :
               result ? <ResultShEx2Shacl result={result}
                                          mode={targetFormatMode(targetFormat)}/> :
               error? <p>Error: {error}</p>:
               null
              }
              { permalink &&  <Permalink url={permalink} /> }

              <ShExTabs activeTab={shExActiveTab}
                        handleTabChange={handleShExTabChange}

                        textAreaValue={shExTextArea}
                        handleByTextChange={handleShExByTextChange}

                        shExUrl={shExUrl}
                        handleShExUrlChange={handleShExUrlChange}

                        handleFileUpload={handleShExFileUpload}

                        shExFormat={shExFormat}
                        handleShExFormatChange={handleShExFormatChange}
              />

              <SelectFormat name="SHACL format"
                            defaultFormat="TURTLE"
                            handleFormatChange={(value) => setTargetFormat(value) }
                            urlFormats={API.shaclFormats} />
              <Button variant="primary" type="submit">Convert to SHACL</Button>
          </Form>
      </Container>
     );
};
