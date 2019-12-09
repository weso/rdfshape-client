import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import DataTabs from "./DataTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "../API";
import axios from "axios";
import SelectFormat from "../components/SelectFormat";
import ResultDataConvert from "../results/ResultDataConvert";
import {dataParamsFromQueryParams} from "../utils/Utils";
import Pace from "react-pace-progress";
import qs from "query-string";
import {mkPermalink, params2Form} from "../Permalink";
import {InitialData, paramsFromStateData, updateStateData, mkDataTabs} from "./Data";

function DataConvert(props) {

    const url = API.dataConvert;
    const [result, setResult] = useState('');
    const [permalink, setPermalink] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState(null);
    const [data,setData] = useState(InitialData);
    const [targetDataFormat, setTargetDataFormat] = useState(API.defaultDataFormat);

    function handleTargetDataFormatChange(value) { setTargetDataFormat(value); }

    useEffect(() => {
        if (props.location.search) {
            const queryParams = qs.parse(props.location.search);
            let params = dataParamsFromQueryParams(queryParams);
            params['targetDataFormat']=queryParams.targetDataFormat;
            setPermalink(mkPermalink(API.dataConvertRoute,params));
            const formData = params2Form(params);
            postConvert(url, formData, () => updateState(params))
        }
    },
     [props.location.search, url]
   );

    function updateState(params) {
        setData(updateStateData(params,data));
        if (params['targetDataFormat'])
          setTargetDataFormat(params['targetDataFormat']);
    }

    function postConvert(url, formData, cb) {
        setLoading(true)
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                setLoading(false);
                setResult(data)
                if (cb) cb()
            })
            .catch(function (error) {
                setError(error);
                setLoading(false);
                console.log('Error doing server request');
                console.log(error);
            });
    }

    function handleSubmit(event) {
        event.preventDefault();
        let params = paramsFromStateData(data);
        params['targetDataFormat'] = targetDataFormat ;
        let formData = params2Form(params);
        let permalink = mkPermalink(API.dataConvertRoute, params);
        setPermalink(permalink);
        postConvert(url,formData);
    }

 return (
       <Container fluid={true}>
         <h1>Convert RDF data</h1>
         <Row>
             { result || loading || error ?
             <Col>
                 { loading ? <Pace color="#27ae60"/> :
                   result ?  <ResultDataConvert result={result}
                                                permalink={permalink} /> :
                    null
                 }
             </Col>
                 : null
             }
          <Col>
           <Form onSubmit={handleSubmit}>
               { mkDataTabs(data,setData) }
               <SelectFormat name="Target data format"
                             selectedFormat={targetDataFormat}
                             handleFormatChange={handleTargetDataFormatChange}
                             urlFormats={API.dataFormats}
               />
               <Button variant="primary" type="submit">Convert data</Button>
           </Form>
          </Col>
         </Row>
       </Container>
 );
}

export default DataConvert;
