import React, {useState, useEffect} from 'react';

import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "../API";
import axios from "axios";
import ResultShExInfo from "../results/ResultShExInfo";
import {mkPermalink, params2Form, Permalink} from "../Permalink";
import Pace from "react-pace-progress";
import qs from "query-string";
import {InitialShEx, mkShExTabs, paramsFromStateShEx, shExParamsFromQueryParams, updateStateShEx} from "./ShEx";

const url = API.schemaInfo ;

function ShExInfo(props) {
  const [result,setResult] = useState('');
  const [permalink,setPermalink] = useState(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);
  const [shex,setShEx] = useState(InitialShEx);

  useEffect(() => {
        console.log("Use Effect - shExInfo");
        if (props.location.search) {
            const queryParams = qs.parse(props.location.search);
            console.log("Parameters: " + JSON.stringify(queryParams));
            let params =  shExParamsFromQueryParams(queryParams);
            const formData = params2Form(params);
            postRequest(url, formData, () => {
                const newShEx = updateStateShEx(params,shex) || shex ;
                setShEx(newShEx)
            })
        }
    },[props.location.search]
    );

    async function handleSubmit(event) {
        let params = paramsFromStateShEx(shex);
        params['schemaEngine'] = 'ShEx';
        let formData = params2Form(params);
        setLoading(true);
        setPermalink(await mkPermalink(API.shExInfoRoute, params));
        postRequest(url, formData);
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
                      { mkShExTabs(shex,setShEx)}
                    <Button variant="primary" type="submit">Info about ShEx schema</Button>
                </Form>
            </Container>
        );
}

export default ShExInfo;
