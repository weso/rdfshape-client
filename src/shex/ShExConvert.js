import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ShExTabs from "./ShExTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "../API";
import axios from "axios";
import ResultShExConvert from "../results/ResultShExConvert";
import SelectFormat from "../components/SelectFormat";
import {mkPermalink, params2Form, Permalink} from "../Permalink";
import Pace from "react-pace-progress";
import qs from "query-string";
import {InitialShEx, paramsFromStateShEx, mkShExTabs, updateStateShEx, shExParamsFromQueryParams} from "./ShEx";


function ShExConvert(props) {

    const [result, setResult] = useState('');
    const [permalink, setPermalink] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState(null);
    const [targetSchemaFormat, setTargetSchemaFormat] = useState(API.defaultShExFormat);
    const [shex,setShex] = useState(InitialShEx);

    const url = API.schemaConvert ;

    function handleTargetSchemaFormatChange(value) {  setTargetSchemaFormat(value); }

    useEffect(() => {
        if (props.location.search) {
            const queryParams = qs.parse(props.location.search);
            let paramsShEx = shExParamsFromQueryParams(queryParams);
            let params = paramsShEx;
            params['targetSchemaFormat'] = queryParams.targetSchemaFormat
            const formData = params2Form(params);
            console.log(`useEffect. props.location.search => FormData: ${JSON.stringify(formData)}`)
            postConvert(url, formData, () => updateStateConvert(params))
        }
    },
     [props.location.search, url]
   );


    function updateStateConvert(params) {
        setShex(updateStateShEx(params,shex))
    }

    function handleSubmit(event) {
        let params =  paramsFromStateShEx(shex);
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
            { mkShExTabs(shex,setShex)}
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
