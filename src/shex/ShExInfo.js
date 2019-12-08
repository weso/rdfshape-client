import React, {useState, useEffect} from 'react';

import Container from 'react-bootstrap/Container';
import ShExTabs from "./ShExTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "../API";
import axios from "axios";
import ResultShExInfo from "../results/ResultShExInfo";
import {shExParamsFromQueryParams} from "../Utils";
import {mkPermalink, params2Form, Permalink} from "../Permalink";
import Pace from "react-pace-progress";
import qs from "query-string";
import Col from "react-bootstrap/Col";
import {InitialShEx, paramsFromStateShEx, updateStateShEx} from "./ShEx";

const url = API.schemaInfo ;

function ShExInfo(props) {
  const [result,setResult] = useState('');
  const [permalink,setPermalink] = useState(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);
  const [shex,setShEx] = useState(InitialShEx);
  const [yashe, setYashe] = useState(null);

    function handleShExTabChange(value) {
        setShEx({...shex, activeTab: value});
    }

    function handleShExFormatChange(value) {
        setShEx({...shex, format: value});
    }

    function handleShExByTextChange(value) {
        setShEx({...shex, textArea: value});
    }

    function handleShExUrlChange(value) {
        setShEx({...shex, url: value});
    }

    function handleShExFileUpload(value) {
        setShEx({...shex, file: value});
    }

  useEffect(() => {
        console.log("Use Effect - shExInfo");
        if (props.location.search) {
            const queryParams = qs.parse(props.location.search);
            console.log("Parameters: " + JSON.stringify(queryParams));
            let params =  shExParamsFromQueryParams(queryParams);
            const formData = params2Form(params);
            postRequest(url, formData, () => updateStateShEx(params))
        }
    },[props.location.search]
    );

    function handleSubmit(event) {
        let params = paramsFromStateShEx(shex);
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
                      <ShExTabs activeTab={shex.activeTab}
                                handleTabChange={handleShExTabChange}

                                textAreaValue={shex.textArea}
                                handleByTextChange={handleShExByTextChange}

                                shExUrl={shex.url}
                                handleShExUrlChange={handleShExUrlChange}

                                handleFileUpload={handleShExFileUpload}

                                selectedFormat={shex.format}
                                handleShExFormatChange={handleShExFormatChange}
                                setCodeMirror={(cm) => {
                                    setYashe(cm);
                                }}
                                fromParams={shex.fromParams}
                                resetFromParams={() => setShEx({...shex, fromParams: false})}
                      />
                    <Button variant="primary" type="submit">Info about ShEx schema</Button>
                </Form>
            </Container>
        );
}

export default ShExInfo;
