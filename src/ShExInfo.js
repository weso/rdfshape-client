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

  function handleShExTabChange(value) { setShExActiveTab(value); }
  function handleShExFormatChange(value) { setShExFormat(value); }
  function handleShExByTextChange(value) { setShExTextArea(value); }
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

                              shExFormat={shExFormat}
                              handleShExFormatChange={handleShExFormatChange}
                    />
                    <Button variant="primary" type="submit">Info about ShEx schema</Button>
                </Form>
            </Container>
        );
}

export default ShExInfo;
