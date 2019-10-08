import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ShExTabs from "./ShExTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "./API";
import axios from "axios";
import ResultShExConvert from "./results/ResultShExConvert";
import SelectFormat from "./SelectFormat";
import { shExParamsFromQueryParams, convertTabSchema} from "./Utils";
import {mkPermalink, params2Form, Permalink} from "./Permalink";
import Pace from "react-pace-progress";
import qs from "query-string";


function ShExConvert(props) {

    const [result, setResult] = useState('');
    const [permalink, setPermalink] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState(null);
    const [shExTextArea, setShExTextArea] = useState("");
    const [shExFormat, setShExFormat] = useState(API.defaultShExFormat);
    const [shExUrl, setShExUrl] = useState("");
    const [shExFile, setShExFile] = useState(null);
    const [shExActiveTab, setShExActiveTab] = useState(API.defaultTab);
    const [targetSchemaFormat, setTargetSchemaFormat] = useState(API.defaultShExFormat);

    const url = API.schemaConvert ;
    function handleShExTabChange(value) { setShExActiveTab(value); }
    function handleShExFormatChange(value) {  setShExFormat(value); }
    function handleShExByTextChange(value) { setShExTextArea(value); }
    function handleShExUrlChange(value) { setShExUrl(value); }
    function handleShExFileUpload(value) { setShExFile(value); }
    function handleTargetSchemaFormatChange(value) {  setTargetSchemaFormat(value); }

    useEffect(() => {
        if (props.location.search) {
            const queryParams = qs.parse(props.location.search);
            let paramsShEx = shExParamsFromQueryParams(queryParams);
            let params = paramsShEx;
            params['targetSchemaFormat']=queryParams.targetSchemaFormat
            const formData = params2Form(params);
            console.log(`useEffect. props.location.search => FormData: ${JSON.stringify(formData)}`)
            postConvert(url, formData, () => updateStateConvert(params))
        }
    },
     [props.location.search, url]
   );


    function updateStateConvert(params) {
        updateStateShEx(params)
    }

    function paramsFromStateShEx() {
        let params = {};
        params['activeSchemaTab'] = convertTabSchema(shExActiveTab);
        console.log(`paramsFromStateShEx: activeSchemaTab: ${shExActiveTab}: ${params['activeSchemaTab']}`);
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
        return params;
    }

    function updateStateShEx(params) {
        console.log(`updateStateShEx: params=`);
        console.log(params);
        if (params['shEx']) {
            setShExActiveTab(API.byTextTab);
            setShExTextArea(params['shEx']);
        }
        if (params['shExUrl']) {
            setShExActiveTab(API.byUrlTab);
            setShExUrl(params['shExUrl']);
        }
        if (params['shExFile']) {
            setShExActiveTab(API.byFileTab);
            setShExFile(params['shExFile'])
        }
        if (params['shExFormat']) 
          setShExFormat(params['shExFormat']);
        if (params['targetSchemaFormat']) {
          setTargetSchemaFormat(params['targetSchemaFormat']);
        }
    }

    function handleSubmit(event) {
        let params =  paramsFromStateShEx();
        params['schemaEngine']='ShEx';
        console.log(`handleSubmit| targetSchemaFormat: ${targetSchemaFormat}`)
        let formData = params2Form(params);
        formData.append('targetSchemaFormat', targetSchemaFormat);
        params['targetSchemaFormat'] = targetSchemaFormat ;
        let perm = mkPermalink(API.shExConvertRoute, params);
        setLoading(true);
        setPermalink(perm);
        postConvert(url,formData)
        event.preventDefault();
    }

    function processResult(data) {
        setResult(data);
    }

    function postConvert(url, formData, cb) {
        console.log(`postConvert: ${url}`)
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                setLoading(false);
                processResult(data);
                if (cb) cb()
            })
            .catch(function (error) {
                setLoading(false);
                setError(`Error doing POST request to ${url}: ${error}`);
                console.log('Error doing server request')
                console.log(error);
            });
    }

    return (
        <Container fluid={true}>
        <h1>ShEx: Convert ShEx schemas</h1>
        <Row>
        { loading || result || error ? 
        <Col>
          { loading ? <Pace color="#27ae60"/> :
            result ?  <ResultShExConvert result={result} /> : 
            null 
          }
          { permalink &&  <Permalink url={permalink} /> }
        </Col>        
        : null 
        }
        <Col>
        <Form onSubmit={handleSubmit}>
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
            <SelectFormat name="Target schema format"
                      selectedFormat={targetSchemaFormat}
                      handleFormatChange={handleTargetSchemaFormatChange}
                      urlFormats={API.shExFormats}
             />
            <Button variant="primary" type="submit">Convert</Button>
        </Form>
        </Col>
        </Row>
     </Container>
    );
}

export default ShExConvert;
