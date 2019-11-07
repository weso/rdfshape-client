import React, {useState, useEffect} from 'react';

import Container from 'react-bootstrap/Container';
import ShExTabs from "./ShExTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "./API";
import axios from "axios";
import ResultShExInfo from "./results/ResultShExInfo";
import {convertTabSchema, shExParamsFromQueryParams} from "./Utils";
import {mkPermalink, params2Form, Permalink} from "./Permalink";
import Pace from "react-pace-progress";
import qs from "query-string";
import Col from "react-bootstrap/Col";

const url = API.schemaInfo ;

function ShExInfo(props) {
  const [result,setResult] = useState('');
  const [permalink,setPermalink] = useState(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);
  const [shExTextArea,setShExTextArea] = useState('');
  const [shExFormat, setShExFormat] = useState(API.defaultShExFormat);
  const [shExUrl, setShExUrl] = useState('');
  const [shExFile, setShExFile] = useState(null);
  const [shExActiveTab,setShExActiveTab] = useState(API.defaultTab);
  const [yashe, setYashe] = useState(null);
  const [fromParamsShEx, setFromParamsShEx] = useState(false);

  function handleShExTabChange(value) { setShExActiveTab(value); }
  function handleShExFormatChange(value) { setShExFormat(value); }
  function handleShExByTextChange(value, y) {
        console.log(`handlingShExByTexthange`)
        setShExTextArea(value);
        if (yashe) { yashe.refresh(); }
    }
  function handleShExUrlChange(value) { setShExUrl(value); }
  function handleShExFileUpload(value) { setShExFile(value); }

  useEffect(() => {
        console.log("Use Effect - shExInfo");
        if (props.location.search) {
            const queryParams = qs.parse(props.location.search);
            console.log("Parameters: " + JSON.stringify(queryParams));
            let params =  shExParamsFromQueryParams(queryParams);
            const formData = params2Form(params);
            postRequest(url, formData, () => updateState(params))
        }
    },[props.location.search]
    );

    function updateState(params) {
        console.log(`UpdateStateShEx: ${JSON.stringify(params)}`);
        if (params['schemaFormat']) setShExFormat(params['schemaFormat']);
        if (params['schema']) {
            setShExActiveTab(API.byTextTab);
            const schema = params['schema'];
            setShExTextArea(schema);
            setFromParamsShEx(true);
            if (params['schemaFormatTextArea']) setShExFormat(params['schemaFormatTextArea']);
        }
        if (params['schemaURL']) {
            setShExActiveTab(API.byUrlTab);
            setShExUrl(params['schemaURL'])
            if (params['schemaFormatUrl']) setShExFormat(params['schemaFormatUrl']);
        }
        if (params['schemaFile']) {
            setShExActiveTab(API.byFileTab);
            setShExFile(params['schemaFile'])
            if (params['schemaFormatFile']) setShExFormat(params['schemaFormatFile']);
        }
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
            return params;
        }

    function handleSubmit(event) {
        let params = paramsFromStateShEx();
        params['schemaEngine']='ShEx';
        let formData = params2Form(params);
        let permalink = mkPermalink(API.shExInfoRoute, params);
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


    return (
            <Container fluid={true}>
                <h1>ShEx: Info ShEx schema</h1>
                    {loading ? <Pace color="#27ae60"/> :
                        result ?
                            <ResultShExInfo result={result} /> : 
                            error?
                              <p>Error: {error}</p>: null
                    }
                    { permalink &&  <Permalink url={permalink} /> }
                  <Form onSubmit={handleSubmit}>
                      <ShExTabs activeTab={shExActiveTab}
                                handleTabChange={handleShExTabChange}

                                textAreaValue={shExTextArea}
                                handleByTextChange={handleShExByTextChange}

                                shExUrl={shExUrl}
                                handleShExUrlChange={handleShExUrlChange}

                                handleFileUpload={handleShExFileUpload}

                                dataFormat={shExFormat}
                                handleShExFormatChange={handleShExFormatChange}
                                setCodeMirror = { (cm) => {setYashe(cm);} }
                                fromParams={fromParamsShEx}
                                resetFromParams={() => setFromParamsShEx(false) }
                      />
                    <Button variant="primary" type="submit">Info about ShEx schema</Button>
                </Form>
            </Container>
        );
}

export default ShExInfo;
