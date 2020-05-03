import React, {useState, useEffect, Fragment} from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import API from "../API";
import axios from 'axios';
import Form from "react-bootstrap/Form";
// import DataTabs from "./DataTabs";
import ResultDataInfo from "../results/ResultDataInfo";
import qs from 'query-string';
import { mkPermalink, params2Form, Permalink} from "../Permalink";
import {dataParamsFromQueryParams} from "../utils/Utils";
import Col from "react-bootstrap/Col";
import Pace from "react-pace-progress";
import Row from "react-bootstrap/Row";
import {InitialData, paramsFromStateData, updateStateData, mkDataTabs} from "./Data";
import ResultDataConvert from "../results/ResultDataConvert";
import SelectFormat from "../components/SelectFormat";

function DataMerge(props) {

    const [data1, setData1] = useState(InitialData);
    const [data2, setData2] = useState(InitialData);
    const [targetDataFormat, setTargetDataFormat] = useState(API.defaultDataFormat);
    const [result,setResult] = useState(null);
    const [error,setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [permalink, setPermalink] = useState(null);

    function handleTargetDataFormatChange(value) { setTargetDataFormat(value); }

    useEffect(() => {
        if (props.location.search) {
            const queryParams = qs.parse(props.location.search);
            let dataParams = dataParamsFromQueryParams(queryParams);
            // params['targetDataFormat']=queryParams.targetDataFormat;
            // const infoUrl = API.dataInfo + "?" + qs.stringify(dataParams);
            postMerge(API.dataConvert, params2Form(dataParams), () => {
                const newData1 = updateStateData(dataParams,data1) || data1 ;
                const newData2 = updateStateData(dataParams,data2) || data2 ;
                setData1(newData1);
                setData2(newData2);
            });
        }},
        [props.location.search]
    );

    function mergeParams(params1,params2) {
        return {"compoundData": JSON.stringify([params1, params2]) };
    }

    function handleSubmit(event) {
        event.preventDefault();
        let params1 = paramsFromStateData(data1);
        let params2 = paramsFromStateData(data2);
        console.log(`params1: ${JSON.stringify(params1)}`);
        console.log(`params2: ${JSON.stringify(params2)}`);
        let params = mergeParams(params1,params2);
        params['targetDataFormat'] = targetDataFormat ;
        let formData = params2Form(params);
        console.log(`formData: ${JSON.stringify(formData)}`);
        let permalink = mkPermalink(API.dataInfoRoute, formData);
        console.log("Permalink created: " + JSON.stringify(permalink));
        setLoading(true);
        setPermalink(permalink);
        postMerge(API.dataConvert, formData);
    }

    function postMerge(url,formData,cb) {

        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                setLoading(false);
                setError(null);
                setResult(data);
                if (cb) cb()
            })
            .catch(function (error) {
                setLoading(false);
                setError("Error calling server at " + url + ": " + error);
            });
    }

    return (
       <Container fluid={true}>
        <Row>
        <h1>Merge & convert RDF data</h1>
        </Row>
        <Row>
           { loading || result || permalink ?
               <Fragment>
                   <Col>
                   {loading ? <Pace color="#27ae60"/> :
                    error? <Alert variant='danger'>{error}</Alert> :
                    result ? <ResultDataConvert result={result}
                                             fromParams={data1.fromParams}
                                             resetFromParams={() => setData1({ ...data1, fromParams: false})}
                    /> : null
                   }
                   { permalink? <Permalink url={permalink} />: null }
                   </Col>
                   </Fragment>
             : null
           }

         <Col>
         <Form onSubmit={handleSubmit}>
             { mkDataTabs(data1,setData1) }
             { mkDataTabs(data2,setData2) }
             <SelectFormat name="Target data format"
                           selectedFormat={targetDataFormat}
                           handleFormatChange={handleTargetDataFormatChange}
                           urlFormats={API.dataFormatsOutput}
             />
         <Button id="submit" variant="primary" type="submit">Merge & convert</Button>
         </Form>
       </Col>
       </Row>
       </Container>
     );
}

export default DataMerge;
